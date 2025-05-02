"use client"

import { useState, useEffect } from "react"
import type { Prompt, PromptCategory } from "@/types/prompt"
import SearchBar from "@/components/search-bar"
import PromptCard from "@/components/prompt-card"
import FancyLoader from "@/components/fancy-loader"
import { toast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

export default function PromptList() {
  // Initialize with empty arrays to prevent hydration errors
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  
  // Set isClient to true once component mounts to ensure we're running in browser
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch initial prompts
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await fetch('/api/prompts')
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to fetch prompts')
        }
        const data = await response.json()
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch prompts')
        }
        const fetchedPrompts = data.data
        setPrompts(fetchedPrompts)
        setFilteredPrompts(fetchedPrompts)
      } catch (error) {
        console.error("Error fetching prompts:", error)
        toast({
          title: "Error loading prompts",
          description: "There was an error loading the prompts. Please try again later.",
          variant: "destructive",
        })
        setPrompts([])
        setFilteredPrompts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPrompts()
  }, [])

  // Listen for category selection from sidebar
  useEffect(() => {
    const handleCategoryFilter = (event: Event) => {
      const customEvent = event as CustomEvent
      setSelectedCategory(customEvent.detail.category)
    }

    document.addEventListener("categoryfilterapplied", handleCategoryFilter)

    return () => {
      document.removeEventListener("categoryfilterapplied", handleCategoryFilter)
    }
  }, [])

  // Filter prompts when search or category changes
  useEffect(() => {
    const filterPrompts = async () => {
      setLoading(true)
      try {
        const queryParams = new URLSearchParams()
        if (searchTerm) queryParams.set('search', searchTerm)
        if (selectedCategory) queryParams.set('category', selectedCategory)
        
        const response = await fetch(`/api/prompts?${queryParams}`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to fetch prompts')
        }
        const data = await response.json()
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch prompts')
        }
        const filtered = data.data
        setFilteredPrompts(filtered)
      } catch (error) {
        console.error("Error filtering prompts:", error)
        toast({
          title: "Error filtering prompts",
          description: "There was an error filtering the prompts. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    filterPrompts()
  }, [searchTerm, selectedCategory])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  return (
    <div className="space-y-6">
      <div className="md:max-w-xl">
        <SearchBar onSearch={handleSearch} />
      </div>

      <AnimatePresence mode="wait">
        {!isClient || loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col justify-center items-center py-12 space-y-4"
          >
            <FancyLoader size="md" />
            <p className="text-muted-foreground animate-pulse">Loading prompts...</p>
          </motion.div>
        ) : filteredPrompts.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredPrompts.map((prompt) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PromptCard prompt={prompt} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="no-results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12 space-y-4"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium">No prompts found</p>
              <p className="text-muted-foreground mt-1">Try a different search term or category.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
