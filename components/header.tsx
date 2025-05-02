"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BookOpen, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import AboutDialog from "./about-dialog"
import AddPromptDialog from "./add-prompt-dialog"

export default function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // To avoid hydration mismatch, render a simplified version until client-side hydration is complete
  if (!mounted) {
    return (
      <header className="sticky top-0 z-20 w-full border-b border-border/50 backdrop-blur-md bg-background/80">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <Link href="/" className="hidden sm:flex text-lg font-medium tracking-tight">
              AI Prompt Glossary
            </Link>
          </div>
          <nav className="flex items-center gap-3">            
            {/* Simplified nav during SSR */}
            <div className="w-10 h-10"></div>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-20 w-full border-b border-border/50 backdrop-blur-md bg-background/80">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <Link href="/" className="hidden sm:flex text-lg font-medium tracking-tight">
            AI Prompt Glossary
          </Link>
        </div>

        <nav className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1 mr-2">
            <Link 
              href="/" 
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname === '/' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
            >
              Browse
            </Link>
          </div>
          
          <AboutDialog />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>
          
          <AddPromptDialog />
        </nav>
      </div>
    </header>
  )
}
