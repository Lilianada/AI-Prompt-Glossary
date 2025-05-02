"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { submitPrompt } from "@/app/actions"
import { CATEGORIES, type PromptCategory } from "@/types/prompt"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import ConfettiIcon from "@/components/ui/confetti-icon"
import { Loader2, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"

export default function AddPromptDialog() {
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [promptText, setPromptText] = useState("")
  const [category, setCategory] = useState<PromptCategory>("Coding")
  const [tags, setTags] = useState("")
  const [useCase, setUseCase] = useState("")
  const [userName, setUserName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Set mounted state when component is mounted on client
  useEffect(() => {
    setMounted(true)
  }, [])

  const resetForm = () => {
    setTitle("")
    setPromptText("")
    setCategory("Coding")
    setTags("")
    setUseCase("")
    setUserName("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !promptText || !category) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("text", promptText)
      formData.append("category", category)
      formData.append("tags", tags)
      formData.append("useCase", useCase)
      formData.append("userName", userName || "Anonymous")

      const result = await submitPrompt(formData)

      if (result.success) {
        toast({
          title: "Prompt submitted",
          description: "Your prompt has been submitted successfully.",
          variant: "success",
          icon: <ConfettiIcon className="h-4 w-4 text-green-500" />,
        })
        resetForm()
        setIsOpen(false)
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.message || "There was an error submitting your prompt.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting prompt:", error)
      toast({
        title: "Error",
        description: "There was an error submitting your prompt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // If not mounted yet, render just the button without dialog functionality to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="rounded-full gap-1.5">
        <Plus className="h-4 w-4" />
        <span>Add Prompt</span>
      </Button>
    )
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full gap-1.5">
          <Plus className="h-4 w-4" />
          <span>Add Prompt</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-medium">Add New Prompt</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Share an AI prompt with the community. It will be added to the collection.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-6">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Component Architecture Analyzer"
              required
              className="h-10 rounded-md px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">
              Prompt Text <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Textarea
                id="prompt"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Enter your prompt text here... (Markdown is supported for lists and formatting)"
                className="min-h-[120px] rounded-md resize-y px-3 py-2 leading-relaxed"
                required
              />
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground opacity-70">
                Markdown supported
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select value={category} onValueChange={(value) => setCategory(value as PromptCategory)}>
              <SelectTrigger id="category" className="h-10 rounded-md">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <AnimatePresence>
                  {CATEGORIES.map((cat) => (
                    <motion.div
                      key={cat}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <SelectItem value={cat}>{cat}</SelectItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="E.g., react, optimization, accessibility"
              className="h-10 rounded-md px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="useCase">Use Case (optional)</Label>
            <Textarea
              id="useCase"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              placeholder="Describe how this prompt can be used..."
              className="min-h-[80px] rounded-md resize-y px-3 py-2 leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userName">Your Name (optional)</Label>
            <Input
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Anonymous"
              className="h-10 rounded-md px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="rounded-full">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="rounded-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Prompt"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
