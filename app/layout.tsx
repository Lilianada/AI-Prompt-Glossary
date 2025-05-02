import type React from "react"
import "./globals.css"
import { GeistSans } from "geist/font/sans"
import { ThemeProvider } from "@/components/theme-provider"
import EnsureData from "@/components/ensure-data"
import { Toaster } from "@/components/toaster"

export const metadata = {
  title: "AI Prompt Glossary",
  description: "A searchable collection of AI prompts for various use cases",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.className} scroll-smooth`}>
      <body className="antialiased bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <EnsureData />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
