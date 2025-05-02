import type React from "react"
import "./globals.css"
import { GeistSans } from "geist/font/sans"
import { ThemeProvider } from "@/components/theme-provider"
import EnsureData from "@/components/ensure-data"
import { Toaster } from "@/components/toaster"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    template: "%s | AI Prompt Glossary",
    default: "AI Prompt Glossary - Discover Effective Prompts for AI Tools"
  },
  description: "A curated collection of effective prompts for working with AI tools like ChatGPT, Claude, and other large language models.",
  keywords: ["AI prompts", "prompt engineering", "ChatGPT prompts", "AI tools", "LLM prompts", "AI assistant"],
  authors: [{ name: "AI Prompt Glossary Community" }],
  creator: "Lilianada",
  publisher: "AI Prompt Glossary",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ai-prompt-glossary.vercel.app/",
    title: "AI Prompt Glossary - Discover Effective Prompts for AI Tools",
    description: "A curated collection of effective prompts for working with AI tools like ChatGPT, Claude, and other large language models.",
    siteName: "AI Prompt Glossary",
    images: [{
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "AI Prompt Glossary"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Prompt Glossary - Discover Effective Prompts for AI Tools",
    description: "A curated collection of effective prompts for working with AI tools.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.jpg" },
    ],
    apple: [
      { url: "/apple-icon.jpg" },
    ],
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://ai-prompt-glossary.vercel.app/"),
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
