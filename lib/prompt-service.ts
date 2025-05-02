import type { Prompt, PromptCategory } from "@/types/prompt"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import matter from "gray-matter"
import { staticPrompts, emptyPrompts } from "@/data/static-prompts"

// Use a function to get the path to ensure it works in both development and production
function getFilePath(fileName: string): string {
  // In development, use process.cwd()
  // In production on Vercel, use /tmp directory for writable files
  const basePath = process.env.NODE_ENV === "production" ? path.join("/tmp") : process.cwd()

  return path.join(basePath, "data", fileName)
}

const PROMPTS_PATH = getFilePath("prompts.mdx")
const NEW_PROMPTS_PATH = getFilePath("new-prompts.mdx")

// Helper function to read all prompt files from the prompts directory
async function readAllPromptFiles(): Promise<Prompt[]> {
  try {
    // Always use static data for client-side rendering
    if (typeof window !== 'undefined' || process.env.NODE_ENV === "production") {
      return staticPrompts
    }

    // In development server-side, try to read from the files
    try {
      // Dynamic import fs only on the server side
      const fs = await import('fs/promises')
      const promptsDir = path.join(process.cwd(), "data", "prompts")
      
      // Get all MDX files in the prompts directory
      const files = await fs.readdir(promptsDir)
      const mdxFiles = files.filter(file => file.endsWith('.mdx'))
      
      // Read each file and parse the frontmatter
      const prompts = await Promise.all(
        mdxFiles.map(async (file) => {
          const filePath = path.join(promptsDir, file)
          const fileContent = await fs.readFile(filePath, "utf8")
          const { data } = matter(fileContent)
          return data as Prompt
        })
      )
      
      return prompts
    } catch (err) {
      console.error("Error reading prompt files:", err)
      return staticPrompts
    }
  } catch (error) {
    console.error("Error in readAllPromptFiles:", error)
    return staticPrompts
  }
}

// Helper function to read all submission files
async function readAllSubmissionFiles(): Promise<Prompt[]> {
  try {
    // Always use empty array for client-side rendering
    if (typeof window !== 'undefined' || process.env.NODE_ENV === "production") {
      return []
    }

    // In development server-side, try to read from the files
    try {
      // Dynamic import fs only on the server side
      const fs = await import('fs/promises')
      const submissionsDir = path.join(process.cwd(), "data", "submissions")
      
      // Ensure directory exists
      await fs.mkdir(submissionsDir, { recursive: true })
      
      // Get all MDX files in the submissions directory
      const files = await fs.readdir(submissionsDir)
      const mdxFiles = files.filter(file => file.endsWith('.mdx'))
      
      // Read each file and parse the frontmatter
      const submissions = await Promise.all(
        mdxFiles.map(async (file) => {
          const filePath = path.join(submissionsDir, file)
          const fileContent = await fs.readFile(filePath, "utf8")
          const { data } = matter(fileContent)
          return data as Prompt
        })
      )
      
      return submissions
    } catch (err) {
      console.error("Error reading submission files:", err)
      return []
    }
  } catch (error) {
    console.error("Error in readAllSubmissionFiles:", error)
    return []
  }
}

// Legacy function kept for compatibility
async function readPromptsFromFile(filePath: string): Promise<Prompt[]> {
  try {
    // Always use static data for client-side rendering
    if (typeof window !== 'undefined' || process.env.NODE_ENV === "production") {
      if (filePath.includes("prompts.mdx")) {
        return staticPrompts
      } else {
        return emptyPrompts
      }
    }

    // In development server-side, try to read from the file
    try {
      // Dynamic import fs only on the server side
      const fs = await import('fs/promises')
      const fileContent = await fs.readFile(filePath, "utf8")
      const { data } = matter(fileContent)
      return data.prompts || []
    } catch (err) {
      // If file doesn't exist in development, use static data
      if (filePath.includes("prompts.mdx")) {
        return staticPrompts
      } else {
        return emptyPrompts
      }
    }
  } catch (error) {
    console.error(`Error reading prompts from ${filePath}:`, error)
    // Fallback to static data
    if (filePath.includes("prompts.mdx")) {
      return staticPrompts
    } else {
      return emptyPrompts
    }
  }
}

// Helper function to write prompts to an MDX file
async function writePromptsToFile(filePath: string, prompts: Prompt[]): Promise<void> {
  // Don't attempt to write files on the client side
  if (typeof window !== 'undefined') {
    console.warn('Cannot write files in browser environment')
    return
  }
  
  const content = `---
prompts: ${JSON.stringify(prompts, null, 2)}
---`

  try {
    // Dynamic import fs only on the server side
    const fs = await import('fs/promises')
    
    // Ensure the directory exists
    const dir = path.dirname(filePath)
    await fs.mkdir(dir, { recursive: true })

    await fs.writeFile(filePath, content, "utf8")
  } catch (error) {
    console.error(`Error writing prompts to ${filePath}:`, error)
    throw new Error("Failed to save prompt")
  }
}

// Get all pending submissions
export async function getSubmissions(): Promise<Prompt[]> {
  // Get submissions from individual files in the submissions directory
  const submissions = await readAllSubmissionFiles()
  
  // Sort by creation date (newest first)
  return submissions.sort((a, b) => b.createdAt - a.createdAt)
}

// Get all approved prompts
export async function getPrompts(searchTerm?: string, category?: PromptCategory): Promise<Prompt[]> {
  // Get prompts from individual files in the prompts directory
  let prompts = await readAllPromptFiles()

  // Apply category filter if provided
  if (category) {
    prompts = prompts.filter((prompt) => prompt.category === category)
  }

  // Apply search filter if provided
  if (searchTerm && searchTerm.trim() !== "") {
    const term = searchTerm.toLowerCase().trim()
    prompts = prompts.filter(
      (prompt) =>
        prompt.title.toLowerCase().includes(term) ||
        prompt.text.toLowerCase().includes(term) ||
        prompt.tags.some((tag) => tag.toLowerCase().includes(term)),
    )
  }

  // Sort by creation date (newest first)
  return prompts.sort((a, b) => b.createdAt - a.createdAt)
}

// Add a new prompt as an individual file in the submissions folder
export async function addNewPrompt(promptData: Omit<Prompt, "id" | "createdAt">): Promise<string> {
  const newPrompt: Prompt = {
    ...promptData,
    id: uuidv4(),
    createdAt: Date.now(),
  }

  // In production, we'll just return the ID without actually writing to the file
  if (process.env.NODE_ENV === "production") {
    return newPrompt.id
  }

  try {
    // Dynamic import fs only on the server side
    const fs = await import('fs/promises')
    
    // Create the submissions directory if it doesn't exist
    const submissionsDir = path.join(process.cwd(), "data", "submissions")
    await fs.mkdir(submissionsDir, { recursive: true })
    
    // Create a new file for the prompt submission
    const filePath = path.join(submissionsDir, `${newPrompt.id}.mdx`)
    
    // Create frontmatter content
    const content = `---
${Object.entries(newPrompt)
  .map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${key}: ${JSON.stringify(value)}`
    }
    return `${key}: ${typeof value === 'string' ? `"${value}"` : value}`
  })
  .join('\n')}
---`
    
    await fs.writeFile(filePath, content, "utf8")
    return newPrompt.id
  } catch (error) {
    console.error("Error saving prompt:", error)
    throw new Error("Failed to save prompt")
  }
}

// For development purposes, we can also add a function to approve prompts from submissions
export async function approvePrompt(promptId: string): Promise<boolean> {
  try {
    // In production, just return success
    if (process.env.NODE_ENV === "production") {
      return true
    }
    
    // Dynamic import fs only on the server side
    const fs = await import('fs/promises')
    
    const promptsDir = path.join(process.cwd(), "data", "prompts")
    const submissionsDir = path.join(process.cwd(), "data", "submissions")
    
    // Ensure directories exist
    await fs.mkdir(promptsDir, { recursive: true })
    
    // Check if the submission file exists
    const submissionPath = path.join(submissionsDir, `${promptId}.mdx`)
    try {
      await fs.access(submissionPath)
    } catch (err) {
      return false
    }
    
    // Read the submission file
    const fileContent = await fs.readFile(submissionPath, "utf8")
    
    // Move to approved prompts directory
    const approvedPromptPath = path.join(promptsDir, `${promptId}.mdx`)
    await fs.writeFile(approvedPromptPath, fileContent, "utf8")
    
    // Remove from submissions
    await fs.unlink(submissionPath)
    
    return true
  } catch (error) {
    console.error("Error approving prompt:", error)
    return false
  }
}
