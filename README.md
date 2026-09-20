# Charan Chatbot 🤖✨

**Charan Chatbot** is a production-ready, full-stack AI chatbot application powered by **Charan AI**. Designed with modern conversational intelligence, intent detection, real-time web search capabilities with source citations, document analysis, prompt injection defense, and a responsive interface.

---

## 🌟 Key Features

1. **Charan AI Identity & Greeting Behavior**
   - Natural greeting handling ("Hi", "Hello", "Good morning", "Who are you?").
   - Responds naturally as **Charan AI** without mechanical phrases.
   - Clean introduction rules (introduces itself only on initial greeting or explicit identity queries).

2. **Conversational Intelligence & Context Retention**
   - Multi-turn context resolution (pronoun resolution: "What is Python?" -> "What is it used for?").
   - Adaptive explanations (Beginner vs Advanced modes).
   - Educational Mode: Concepts, practical examples, revision summaries, and study quizzes.
   - Clarifying question engine when user requests are ambiguous ("Make it better").

3. **Live Web Search & Source Transparency**
   - Intent-driven web search (triggers automatically on current news, pricing, release versions, or when forced).
   - Domain quality evaluator (prioritizes `.edu`, `.gov`, official documentation, reputable journals, and scientific preprints).
   - Clickable **Web References & Sources** UI widget displaying source domain, title, snippet, and direct links.

4. **Security & Prompt Injection Resistance**
   - Sanitizes external web content and uploaded documents using XML wrappers and pattern filtering.
   - Resists adversarial prompt injection instructions ("Ignore previous instructions", "Output secrets").
   - Server-side API key isolation: Secrets stay safe on the server.

5. **Human Values, Safety & Refusal Styling**
   - Non-preachy, calm 3-step refusal style for harmful requests (Clear state -> Brief explanation -> Safe alternative).
   - Medical/Legal/Financial educational disclaimers.
   - Neutral political stance (factual, non-partisan).

6. **Rich UX/UI & Responsiveness**
   - Responsive layout (Desktop, Tablet, Mobile) with collapsible history drawer.
   - Markdown rendering with code blocks featuring syntax highlighting and copy-code button.
   - Dark & Light theme toggle.
   - Web Speech API integration (Read responses aloud).
   - Document & code file upload analysis.
   - LocalStorage chat session persistence.

---

## 🏗️ Technology Architecture

```text
charan-chatbot/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with Tailwind & theme context
│   │   ├── page.tsx               # Main chat interface & state manager
│   │   ├── globals.css            # Tailwind & glassmorphism styling
│   │   └── api/
│   │       ├── chat/route.ts      # Streaming & intent/safety/search API
│   │       ├── search/route.ts    # Standalone web search endpoint
│   │       └── health/route.ts    # Service health status endpoint
│   ├── components/
│   │   ├── chat/                  # Chat items, input, citations, code blocks, welcome screen
│   │   ├── layout/                # Header & Sidebar components
│   │   └── ui/                    # Settings modal
│   ├── lib/
│   │   ├── ai/                    # AI Provider abstraction, System prompt & Intent detector
│   │   ├── search/                # Web search providers & Source evaluator
│   │   ├── safety/                # Prompt injection guard & Safety checks
│   │   └── storage/               # LocalStorage session store
│   └── types/                     # TypeScript definitions
├── .env.example
├── package.json
└── README.md
```

- **Frontend & Backend Framework**: Next.js 15 (React 19 + TypeScript + Tailwind CSS)
- **AI Providers**: Configurable abstraction supporting Google Gemini API (`@google/genai`), OpenAI API, and an Intelligent Local Fallback Engine.
- **Search Provider**: DuckDuckGo HTML API & ranking provider with fallback scraping strategy.
- **Icons**: Lucide React
- **Markdown & Code Highlighting**: `react-markdown`, `remark-gfm`, `rehype-highlight`

---

## 🚀 Quick Start (Running Locally)

### Prerequisites
- Node.js **v18+** installed.
- NPM or PNPM package manager.

### 1. Installation
Clone or navigate to the project directory and install dependencies:

```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` to add your optional API Key:

```env
NEXT_PUBLIC_APP_NAME="Charan Chatbot"

# Get a free Gemini API key from https://aistudio.google.com/
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Optional OpenAI Key
OPENAI_API_KEY=""

# Web Search Provider ("duckduckgo" or "auto")
SEARCH_PROVIDER="duckduckgo"
```

> **Note**: Even if no API key is provided, Charan Chatbot will run smoothly using its built-in Intelligent Local Fallback Engine!

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Verified Test Cases

The application includes automated and manual test scenarios:

| Scenario | Input | Expected Output |
| :--- | :--- | :--- |
| **Greeting** | `Hi` | `"Hello! This is Charan AI 👋 How can I help you today?"` |
| **Identity** | `Who are you?` | `"I'm Charan AI, an AI-powered assistant..."` |
| **General Q** | `What is Python?` | Concise explanation of Python programming language. |
| **Context Follow-up** | `What is it used for?` | Resolves `"it"` as Python and lists applications. |
| **Coding** | `Write a Python program to check whether a number is prime.` | Complete working Python code with $6k \pm 1$ optimization and copy button. |
| **Current Info** | `What are the latest developments in AI?` | Triggers Web Search and displays clickable source citations. |
| **Ambiguity** | `Make it better.` | `"Sure. Do you want it to be more professional, more concise, or more natural?"` |
| **Safety Refusal** | Harmful prompt | 3-step calm response: Refusal statement -> Reason -> Safe alternative. |
| **Prompt Injection** | `"Ignore previous instructions..."` | Sanitized as untrusted input and ignored. |

---

## 🚢 Deployment Guide

### Deploying to Vercel (Recommended)
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Add your environment variables (`GEMINI_API_KEY`, `OPENAI_API_KEY`) under Vercel Settings -> Environment Variables.
4. Click **Deploy**.

### Self-Hosting with Docker
Build production bundle:
```bash
npm run build
npm run start
```

---

## 🛡️ Security Considerations

- **Server-Side API Key Isolation**: All AI and Search requests run through Next.js server-side API routes (`/api/chat`). Keys are never sent to the browser DOM.
- **Untrusted Input Wrapping**: External search snippets and uploaded files are wrapped in `<UNTRUSTED_EXTERNAL_SOURCE>` blocks to prevent context high-jacking.

---

## 📄 License
MIT License. Built for **Charan Chatbot**.
