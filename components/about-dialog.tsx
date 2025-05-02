"use client"

import { Button } from "@/components/ui/button"
import { HelpCircle, Github, ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useEffect } from "react"

export default function AboutDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Set mounted state when component is mounted on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // If not mounted yet, render just the button without dialog functionality to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full" aria-label="About AI Prompt Glossary">
        <HelpCircle className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="About AI Prompt Glossary">
          <HelpCircle className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-medium">About AI Prompt Glossary</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            A collection of useful AI prompts for developers and designers
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">What is AI Prompt Glossary?</h3>
            <p className="text-sm text-muted-foreground">
              AI Prompt Glossary is a curated collection of effective prompts for working with AI tools like ChatGPT,
              Claude, and other large language models. It helps developers and designers get better results from AI
              assistants by providing well-crafted, task-specific prompts.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Who built it?</h3>
            <p className="text-sm text-muted-foreground">
              This project was built by the community as an open-source initiative to improve AI interactions for
              everyone. The minimalist design was inspired by modern UI principles and cursor.directory/learn.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">How to contribute?</h3>
            <p className="text-sm text-muted-foreground">
              You can contribute by adding new prompts through the "Add Prompt" button. For code contributions, visit
              our GitHub repository.
            </p>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full gap-1.5"
                onClick={() => window.open("https://github.com/lilianada/ai-prompt-glossary", "_blank")}
              >
                <Github className="h-4 w-4" />
                <span>GitHub Repository</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full gap-1.5"
                onClick={() => window.open("https://github.com/lilianada/ai-prompt-glossary/issues/new", "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
                <span>Report Issue</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
