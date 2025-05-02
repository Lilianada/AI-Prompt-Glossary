"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CATEGORIES, type PromptCategory } from "@/types/prompt"
import { submitPrompt } from "@/app/actions"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { motion } from "framer-motion"

// Define the form schema with validation
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title cannot exceed 100 characters"),
  text: z.string().min(10, "Prompt text must be at least 10 characters"),
  category: z.enum(CATEGORIES as [string, ...string[]]),
  tags: z.string().optional(),
  useCase: z.string().optional(),
  userName: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function PromptSubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      text: "",
      category: undefined,
      tags: "",
      useCase: "",
      userName: "",
    },
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    
    try {
      // Convert form data for server action
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value)
        }
      })
      
      const result = await submitPrompt(formData)
      
      if (result.success) {
        toast({
          title: "Success!",
          description: "Your prompt has been submitted for review.",
        })
        form.reset()
        setSubmitted(true)
      } else {
        toast({
          title: "Submission failed",
          description: result.message || "There was an error submitting your prompt. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting prompt:", error)
      toast({
        title: "Submission error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-muted/30 p-6 rounded-lg text-center space-y-4"
      >
        <h3 className="text-xl font-medium">Thank You!</h3>
        <p className="text-muted-foreground">
          Your prompt has been submitted for review. Once approved, it will appear in the prompt library.
        </p>
        <Button onClick={() => setSubmitted(false)}>Submit Another Prompt</Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Submit a Prompt</h2>
        <p className="text-muted-foreground mt-1">
          Share your favorite AI prompts with the community.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Give your prompt a descriptive title" {...field} />
                </FormControl>
                <FormDescription>
                  A clear title helps others find your prompt.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt Text</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your prompt text here..."
                    className="min-h-32 resize-y"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The actual prompt text that would be sent to an AI.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the most relevant category.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="creativity, writing, code, etc." {...field} />
                  </FormControl>
                  <FormDescription>
                    Comma-separated tags to help with search.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="useCase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Use Case (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe how and when to use this prompt..."
                    className="min-h-20 resize-y"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Explain when and how to use this prompt effectively.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Anonymous" {...field} />
                </FormControl>
                <FormDescription>
                  How you'd like to be credited for this prompt.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Submit Prompt"
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  )
}
