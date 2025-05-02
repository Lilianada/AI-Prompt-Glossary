export type PromptCategory =
  | "Writing"
  | "Design"
  | "Coding"
  | "Marketing"
  | "Business"
  | "Education"
  | "Personal"
  | "Other"

export const CATEGORIES: PromptCategory[] = [
  "Writing",
  "Design",
  "Coding",
  "Marketing",
  "Business",
  "Education",
  "Personal",
  "Other",
]

export interface Prompt {
  id: string
  title: string
  text: string
  category: PromptCategory
  tags: string[]
  useCase?: string
  userName?: string
  createdAt: number
}
