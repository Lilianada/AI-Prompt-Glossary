import { Suspense } from "react"
import Header from "@/components/header"
import PromptList from "@/components/prompt-list"
import CategorySidebar from "@/components/category-sidebar"
import FancyLoader from "@/components/fancy-loader"

export const dynamic = "force-dynamic"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex">
        {/* Sidebar - now fixed */}
        <aside className="hidden md:block w-64 fixed top-14 bottom-0 border-r overflow-y-auto">
          <div className="p-4 h-full">
            <CategorySidebar />
          </div>
        </aside>

        {/* Main content - with left margin to account for fixed sidebar */}
        <div className="flex-1 py-6 px-4 md:px-6 md:ml-64">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-medium tracking-tight">AI Prompt Glossary</h1>
              <p className="text-sm text-muted-foreground">
                Search and discover AI prompts for various development and design use cases
              </p>
            </div>

            <Suspense
              fallback={
                <div className="flex justify-center items-center py-12">
                  <FancyLoader size="md" />
                </div>
              }
            >
              <PromptList />
            </Suspense>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t md:ml-64">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AI Prompt Glossary. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
