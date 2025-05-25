# LearnSphere

An AI-powered course creation platform built with Next.js that helps create comprehensive learning materials from PDF content.

## Features

- **AI-Powered Course Generation**: Upload PDFs and automatically generate structured course content
- **Interactive Study Materials**:
  - Notes & Chapters: Organized course content with chapter navigation
  - Flashcards: Interactive study cards for better retention
  - Quizzes: Test your knowledge with AI-generated questions
  - Q&A: Detailed questions and answers for deeper understanding

- **User Dashboard**: Track and manage your courses
- **Responsive Design**: Works seamlessly across all devices

## Tech Stack

- Next.js 13+ with App Router
- MongoDB for data storage
- Supabase for file storage
- Google's Gemini AI for content generation
- Tailwind CSS for styling
- Clerk for authentication

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:
Create a `.env` file with:
```
DATABASE_URL=your_mongodb_url
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
your_clerk_publishable_key=your_clerk_secret_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
