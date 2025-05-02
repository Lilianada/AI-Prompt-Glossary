"use client"

import { CATEGORIES, type PromptCategory } from "@/types/prompt"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface CategoryFilterProps {
  selectedCategory: PromptCategory | null
  onSelectCategory: (category: PromptCategory | null) => void
}

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-nowrap gap-1.5 overflow-x-auto pb-2 md:flex-wrap scrollbar-hide">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        className={`whitespace-nowrap rounded-full text-sm h-8 px-4 ${
          selectedCategory === null ? "bg-primary text-primary-foreground" : "bg-transparent"
        }`}
        onClick={() => onSelectCategory(null)}
        aria-pressed={selectedCategory === null}
      >
        All
      </Button>

      {CATEGORIES.map((category) => (
        <motion.div key={category} whileTap={{ scale: 0.97 }}>
          <Button
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            className={`whitespace-nowrap rounded-full text-sm h-8 px-4 ${
              selectedCategory === category ? "bg-primary text-primary-foreground" : "bg-transparent"
            }`}
            onClick={() => onSelectCategory(category)}
            aria-pressed={selectedCategory === category}
          >
            {category}
          </Button>
        </motion.div>
      ))}
    </div>
  )
}
