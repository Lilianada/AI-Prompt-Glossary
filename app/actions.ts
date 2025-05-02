"use server"

import { addNewPrompt } from "@/lib/prompt-service"
import type { PromptCategory } from "@/types/prompt"

export async function submitPrompt(formData: FormData) {
  const title = formData.get("title") as string
  const text = formData.get("text") as string
  const category = formData.get("category") as PromptCategory
  const tagsString = formData.get("tags") as string
  const useCase = formData.get("useCase") as string
  const userName = (formData.get("userName") as string) || "Anonymous"

  if (!title || !text || !category) {
    return { success: false, message: "Missing required fields" }
  }

  const tags = tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "")

  try {
    await addNewPrompt({
      title,
      text,
      category,
      tags,
      useCase: useCase || undefined,
      userName,
    })

    return { success: true, message: "Prompt submitted successfully" }
  } catch (error) {
    console.error("Error adding prompt:", error)
    return { success: false, message: "Failed to submit prompt" }
  }
}
