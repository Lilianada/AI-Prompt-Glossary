import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), "data")

    // Ensure data directory exists
    try {
      await fs.mkdir(dataDir, { recursive: true })
    } catch (err) {
      // Directory might already exist
    }

    // Check if prompts.mdx exists, if not create it
    try {
      await fs.access(path.join(dataDir, "prompts.mdx"))
    } catch (err) {
      // File doesn't exist, create it
      const content = `---
prompts: []
---`
      await fs.writeFile(path.join(dataDir, "prompts.mdx"), content)
    }

    // Check if new-prompts.mdx exists, if not create it
    try {
      await fs.access(path.join(dataDir, "new-prompts.mdx"))
    } catch (err) {
      // File doesn't exist, create it
      const content = `---
prompts: []
---`
      await fs.writeFile(path.join(dataDir, "new-prompts.mdx"), content)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error ensuring data files:", error)
    return NextResponse.json({ success: false, error: "Failed to ensure data files" }, { status: 500 })
  }
}
