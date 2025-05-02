# AI Prompt Glossary

A modern web application for cataloging, sharing, and discovering effective AI prompts. Built with Next.js, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Browse Prompts**: Explore a curated collection of AI prompts organized by category
- **Search & Filter**: Find prompts by keyword or category
- **Submit Prompts**: Share your own effective prompts with the community
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode**: Toggle between light and dark themes

## 🛠️ Technology Stack

- **Framework**: Next.js 15.x (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI
- **Animations**: Framer Motion
- **Content**: MDX for prompt storage

## 📂 Project Structure

```
/app                  # Next.js app router pages
  /api                # API routes for data fetching
  /submit             # Prompt submission page
/components           # React components
  /ui                 # Reusable UI components
/data                 # Data storage
  /prompts            # Approved prompts (MDX files)
  /submissions        # User-submitted prompts pending approval
/lib                  # Utility functions and services
/types                # TypeScript type definitions
/public               # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Lilianada/AI-Prompt-Glossary.git
cd AI-Prompt-Glossary

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:3000

## 🔧 Development

### Adding New Prompts

Prompts are stored as MDX files in the `/data/prompts` directory. Each prompt has its own file with frontmatter metadata:

```mdx
---
id: "unique-id"
title: "Prompt Title"
text: "The actual prompt text..."
category: "Coding"
tags: ["tag1", "tag2"]
useCase: "When to use this prompt"
userName: "Author Name"
createdAt: 1714503642000
---
```

### Submission Workflow

1. Users submit prompts through the UI
2. Submissions are stored in `/data/submissions` as MDX files
3. Admins can review and approve submissions
4. Approved prompts are moved to `/data/prompts`

## 📝 License

MIT

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
