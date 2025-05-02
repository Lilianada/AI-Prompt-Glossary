import { Metadata } from "next"
import PromptSubmissionForm from "@/components/prompt-submission-form"

export const metadata: Metadata = {
  title: "Submit a Prompt | AI Prompt Glossary",
  description: "Share your favorite AI prompts with the community.",
}

export default function SubmitPage() {
  return (
    <div className="container max-w-4xl py-10">
      <PromptSubmissionForm />
    </div>
  )
}
