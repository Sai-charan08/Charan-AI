# Charan AI 🤖✨

[![Live App](https://img.shields.io/badge/Live_App-thotasaicharan.vercel.app-gold?style=for-the-badge&logo=vercel)](https://thotasaicharan.vercel.app/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript 6](https://img.shields.io/badge/TypeScript-6.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Cloud_DB-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

**Charan AI** is an advanced, production-grade multimodal AI workspace application available as a responsive web application and an installable native PWA app on any mobile device or laptop. It combines deep reasoning LLMs, real-time web search, sub-2 second AI image synthesis, document vector RAG, multi-format document exporting, personalized behavioral personas, and MongoDB cloud synchronization.

---

## 🌐 Live Production Application
👉 **Live Web & App Link**: **[https://thotasaicharan.vercel.app/](https://thotasaicharan.vercel.app/)**

Anyone can access and use **Charan AI** immediately on any device (Android, iPhone, Windows, macOS, Linux) without downloading from an app store.

---

## 📲 How to Install Charan AI as a Native App

### 📱 1. Android Phones & Tablets
- Open [https://thotasaicharan.vercel.app/](https://thotasaicharan.vercel.app/) in Chrome or Edge.
- Open the left sidebar and tap **"Install App (Mobile / Laptop)"**, or tap Chrome's menu **(⋮)** → **"Install app"**.
- Tap **Install**. The **Charan AI** golden logo will appear on your Home Screen and App Drawer.

### 🍎 2. iPhone & iPad (iOS Safari)
- Open [https://thotasaicharan.vercel.app/](https://thotasaicharan.vercel.app/) in **Safari**.
- Tap the **Share** button at the bottom of the screen (square with arrow pointing up `⎋`).
- Scroll down and tap **"Add to Home Screen"**.
- Tap **Add** in the top right corner.

### 💻 3. Windows Laptop / Mac / Linux (Chrome & Edge)
- Open [https://thotasaicharan.vercel.app/](https://thotasaicharan.vercel.app/) in Chrome or Microsoft Edge.
- Click the **Install App** icon in the address bar (or click **"Install App (Mobile / Laptop)"** in the left sidebar).
- Click **Install** to launch Charan AI as a standalone desktop window application.

---

## 🌟 Key Features

### 1. 🌐 4 Dynamic Active Workspaces
Switch active workspaces seamlessly via the Sidebar to transform the entire application UI and AI model system directives:
- 🌐 **General Workspace**: All-domain intelligence for **Study Roadmaps**, **Political Science & Civics**, **Fitness & Workout Splits**, and **General Knowledge**.
- 🎨 **AI Visual Studio**: Sub-2 second Turbo AI image synthesis for **Photorealistic Artwork**, **UI/UX Mockups**, **Vector Logos**, and **3D Render Scenes**.
- 📄 **Document & Data RAG**: High-precision RAG analysis for **PDF Executive Summaries**, **Excel Spreadsheet Analytics**, **CSV Table Extraction**, and **Semantic Vector Q&A**.
- 💻 **Code & Architecture Lab**: Powered by **DeepSeek R1** reasoning for **Next.js 15 & React 19 Components**, **O(n log n) Algorithm Optimization**, **Microservices Architecture**, and **Memory Leak Debugging**.

---

### 2. 👤 Personalization & Behavioral Persona Engine
Customize how **Charan AI** interacts with you directly from the Settings & Persona Modal:
- **User Calling Name**: Specify your preferred name (e.g. *Charan*, *Dr. Alex*, *Professor*). Charan AI addresses you directly in conversation.
- **Behavior & Tone Style**:
  - 💼 **Professional & Academic**: Formal, structured, executive, and highly articulate.
  - 😊 **Friendly & Conversational**: Warm, encouraging, and approachable.
  - 🧑‍💻 **Humanized & Plagiarism-Free**: Relatable, fluid human narrative flow.
  - 🚀 **Concise & Direct**: Bullet-pointed, zero fluff or filler.
- **Response Accuracy & Factuality Levels**:
  - 🎯 **Strict Factuality & Zero Hallucination**: Precise, verified data and exact citations.
  - ⚖️ **Balanced Accuracy & Context**: Default analytical accuracy with context.
  - 💡 **Creative & Exploratory**: Open brainstorming and imaginative possibilities.
- **100% Plagiarism-Free Guarantee**: Enforces unique, humanized phrasing while avoiding canned AI template clichés (*"As an AI language model..."*, *"Certainly!"*, *"In today's fast-paced world..."*).

---

### 3. 🎨 Sub-2 Second AI Image Generation
- Turbo AI visual model generates high-resolution concept art, UI mockups, and logos in under 2 seconds.
- Interactive **AI Visual Card** featuring instant variation generation (`Refresh`), full-screen zoom preview, and direct JPEG downloads.

---

### 4. 📄 Multi-Format Document Exporters
Export any assistant response or generated data into 4 downloadable file formats:
- 📄 **PDF**: Clean, printable PDF documents with header branding and timestamps.
- 📊 **Excel / CSV**: Extracts tables and structured data into `.csv` / `.xlsx` spreadsheet files.
- ⚙️ **JSON**: Formats structured data and code objects into clean `.json` files.
- 📝 **TXT**: Exports plain text and markdown notes into `.txt` documents.

---

### 5. 🗄️ MongoDB Cloud Database & Authentication Sync
- **Firebase Authentication**: Sign In / Sign Up with Google OAuth & Email/Password, or use Guest Mode.
- **MongoDB Sync**: Automatically syncs user profile data, settings, and user-isolated chat history to MongoDB (`users` and `chat_sessions` collections).
- **Hybrid Storage**: LocalStorage caching for zero-latency UI + MongoDB cloud database persistence.

---

### 6. 🌐 Live Web Search & Citation Transparency
- Automatic real-time web search for current events, news, releases, and factual data.
- Clickable **Source Citations** showing domain quality badges (`.gov`, `.edu`, trusted documentation), snippets, and direct links.

---

## 🏗️ Technology Architecture

```text
charan-ai/
├── public/
│   ├── manifest.json          # PWA Web App Manifest
│   ├── sw.js                  # Offline Service Worker engine
│   ├── icon-192.png           # 192x192 PWA App Icon
│   ├── icon-512.png           # 512x512 PWA App Icon
│   ├── apple-touch-icon.png   # iOS Touch App Icon
│   └── favicon.ico            # Favicon Emblem
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with font, metadata & Service Worker registration
│   │   ├── page.tsx               # Core workspace container & state manager
│   │   ├── globals.css            # Dark studio design tokens & glowing styles
│   │   └── api/
│   │       ├── chat/route.ts      # Streaming SSE chat API with custom system prompts
│   │       ├── sessions/route.ts  # MongoDB chat session CRUD endpoints
│   │       ├── user/sync/route.ts # MongoDB user profile sync endpoint
│   │       ├── search/route.ts    # Real-time web search service
│   │       └── health/route.ts    # Health check status endpoint
│   ├── components/
│   │   ├── auth/                  # AuthModal with Google OAuth & Email authentication
│   │   ├── chat/                  # AIImageCard, CodeBlock, MessageInput, MessageItem, WelcomeScreen
│   │   ├── layout/                # Header & Sidebar with embedded workspace selector
│   │   └── ui/                    # Logo ('C' emblem) & SettingsModal
│   ├── lib/
│   │   ├── ai/                    # System prompt builder, Intent detector & AI providers
│   │   ├── auth/                  # Firebase Auth context & config
│   │   ├── db/                    # MongoDB client & Mongoose user/session schemas
│   │   ├── export/                # PDF, CSV, JSON, TXT document exporters
│   │   └── storage/               # LocalStorage & MongoDB sync helpers
│   └── types/                     # TypeScript type definitions
├── package.json
└── README.md
```

- **Framework**: Next.js 16 (App Router + Turbopack + React 19 + TypeScript + Tailwind CSS)
- **Deployment Platform**: Vercel Cloud ([https://thotasaicharan.vercel.app/](https://thotasaicharan.vercel.app/))
- **Database**: MongoDB (via `mongoose` and `mongodb` client)
- **Authentication**: Firebase Authentication
- **AI Models**: Google Gemini 2.5 Flash, OpenAI GPT-4o, DeepSeek R1, Charan Omni-Domain RAG
- **Icons & Markdown**: Lucide React, `react-markdown`, `remark-gfm`, `rehype-highlight`

---

## 🚀 Quick Start (Running Locally)

### Prerequisites
- Node.js **v18+** installed.
- NPM or PNPM package manager.

### 1. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/Sai-charan08/Charan-AI.git
cd Charan-AI
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` to set your environment variables:

```env
# MongoDB Connection String (Local or MongoDB Atlas)
MONGODB_URI="mongodb://127.0.0.1:27017/charan_ai_db"

# Optional AI Engine API Keys
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License
MIT License. Built for **Charan AI**.
