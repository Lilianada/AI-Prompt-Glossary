"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { Prompt } from "@/types/prompt"
import { Copy, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import MarkdownRenderer from "@/components/markdown-renderer"

interface PromptCardProps {
  prompt: Prompt
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const [copied, setCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleCopyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(prompt.text)
    setCopied(true)
    toast({
      title: "Copied to clipboard",
      description: "The prompt has been copied to your clipboard.",
      variant: "success",
    })

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  // Format the date
  const formattedDate = new Date(prompt.createdAt).toLocaleDateString()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="overflow-hidden relative h-[260px] group"
    >
      <div
        className={`border transition-colors h-full rounded-md flex flex-col overflow-hidden
        ${isHovered ? "border-primary/20 bg-primary/5" : "border-border/30 bg-card/10"}`}
      >
        {/* Header */}
        <div className="p-4 flex items-start justify-between border-b border-border/20">
          <h3
            className={`text-base font-medium transition-colors ${isHovered ? "text-foreground" : "text-muted-foreground"}`}
          >
            {prompt.title}
          </h3>
          <button
            onClick={handleCopyToClipboard}
            className={`rounded-full p-1 transition-opacity ${isHovered ? "opacity-100" : "opacity-0"}`}
            aria-label="Copy to clipboard"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            )}
          </button>
        </div>

        {/* Scrollable Content */}
        <div ref={contentRef} className="flex-1 p-4 overflow-y-auto text-sm">
          <div className={`transition-colors ${isHovered ? "text-foreground" : "text-muted-foreground"}`}>
            <MarkdownRenderer content={prompt.text} />
          </div>

          {prompt.useCase && (
            <div className={`mt-4 transition-colors ${isHovered ? "text-foreground/80" : "text-muted-foreground/70"}`}>
              <h4 className="text-xs font-medium mb-1">Use Case:</h4>
              <p className="text-xs">{prompt.useCase}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-3 border-t border-border/20 transition-colors 
          ${isHovered ? "bg-primary/5" : "bg-card/5"}`}
        >
          <div className="flex justify-between items-center">
            <div className={`flex flex-wrap gap-1.5 transition-opacity ${isHovered ? "opacity-100" : "opacity-60"}`}>
              {prompt.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs px-1.5 py-0.5 bg-muted/30 rounded-full">
                  {tag}
                </span>
              ))}
              {prompt.tags.length > 3 && (
                <span className="text-xs px-1.5 py-0.5 bg-muted/30 rounded-full">+{prompt.tags.length - 3} more</span>
              )}
            </div>
            <span
              className={`text-xs transition-colors ${isHovered ? "text-foreground/70" : "text-muted-foreground/50"}`}
            >
              {prompt.userName || "Anonymous"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
