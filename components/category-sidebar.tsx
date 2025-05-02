"use client"

import { useState, useEffect } from "react"
import { CATEGORIES, type PromptCategory, type Prompt } from "@/types/prompt"

interface CategoryWithCount {
  name: PromptCategory | "All"
  count: number
}

export default function CategorySidebar() {
  // Initialize with static categories structure to prevent hydration mismatch
  const initialCategories: CategoryWithCount[] = [
    { name: "All", count: 0 },
    ...CATEGORIES.map(category => ({ name: category, count: 0 }))
  ];
  
  const [categories, setCategories] = useState<CategoryWithCount[]>(initialCategories)
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | "All">("All")
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Set mounted state when component is mounted on client
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Fetch category counts after initial render
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
    const fetchCategoryCounts = async () => {
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
        
        const allPrompts = data.data

        // Count prompts per category
        const categoryCounts = new Map<string, number>()
        categoryCounts.set("All", allPrompts.length)

        allPrompts.forEach((prompt: Prompt) => {
          const count = categoryCounts.get(prompt.category) || 0
          categoryCounts.set(prompt.category, count + 1)
        })

        // Convert to array format needed for display
        const categoriesWithCounts: CategoryWithCount[] = [{ name: "All", count: categoryCounts.get("All") || 0 }]

        CATEGORIES.forEach((category) => {
          categoriesWithCounts.push({
            name: category,
            count: categoryCounts.get(category) || 0,
          })
        })

        setCategories(categoriesWithCounts)
      } catch (error) {
        console.error("Error fetching category counts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryCounts()
  }, [])

  const handleCategorySelect = (category: PromptCategory | "All") => {
    setSelectedCategory(category)
    // Dispatch an event that the PromptList component will listen to
    const event = new CustomEvent("categoryfilterapplied", {
      detail: { category: category === "All" ? null : category },
    })
    document.dispatchEvent(event)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Categories</h3>
      <div className="space-y-1">
        {!mounted || loading ? (
          // Skeleton loader for categories
          Array.from({ length: CATEGORIES.length + 1 }).map((_, index) => (
            <div 
              key={`skeleton-${index}`} 
              className="w-full h-8 bg-muted/40 animate-pulse rounded-md mb-1"
            />
          ))
        ) : (
          categories.map((category) => (
            <button
              key={category.name}
              onClick={() => handleCategorySelect(category.name)}
              className={`w-full text-left py-1.5 px-2 text-sm rounded-md flex justify-between items-center transition-colors ${
                selectedCategory === category.name
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <span>{category.name}</span>
              <span className="text-xs bg-muted/30 rounded-full px-1.5 py-0.5">{category.count}</span>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
