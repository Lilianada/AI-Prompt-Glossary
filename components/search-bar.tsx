"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SearchBarProps {
  onSearch: (term: string) => void
  initialValue?: string
}

export default function SearchBar({ onSearch, initialValue = "" }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)

  // Debounce search term changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchTerm)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, onSearch])

  const handleClear = () => {
    setSearchTerm("")
    onSearch("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch(searchTerm)
    }
  }

  return (
    <div className="relative w-full">
      <div
        className={`flex w-full items-center space-x-2 transition-all duration-200 ${isFocused ? "scale-[1.01]" : ""}`}
      >
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <Input
            type="text"
            placeholder="Search prompts by title, content, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="pl-10 pr-10 h-10 rounded-md border-border/50 bg-secondary/30 focus:bg-secondary/50"
            aria-label="Search prompts"
          />
          <AnimatePresence>
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground rounded-full flex items-center justify-center h-5 w-5"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
