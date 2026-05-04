# 🌍 Global DevBridge

An asynchronous collaboration platform for distributed engineering teams. Built with a modern **React (Vite) + Tailwind** frontend and a robust **Node.js (Express) + PostgreSQL** backend, featuring an AI-powered RAG pipeline to automatically summarize daily standups and blockers.

---

## 🧱 Tech Stack
- **Frontend**: React.js, TypeScript, Tailwind CSS, Recharts, Vite
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, JSON Web Tokens
- **Database**: PostgreSQL
- **AI/ML**: LangChain.js, OpenAI, In-Memory Vector Store (ready for `pgvector`)
- **DevOps**: Docker, Docker Compose

---

## 🚀 Features
- **Async Standups**: Submit daily updates (Completed, Planning, Blockers).
- **AI Summaries (RAG)**: Automatically generate team-wide summaries highlighting blockers and trends using OpenAI and LangChain.
- **Modern UI**: Slack/Notion inspired interface with premium dark mode and glassmorphism styling.
- **Decisions Log** *(Architecture ready)*: Track project architecture decisions over time.

---

## 💻 Local Development Setup (Manual)

### 1. Backend Setup
\`\`\`bash
cd backend
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your PostgreSQL credentials and OpenAI API Key!

# Run database migrations
npx prisma generate
npx prisma db push

# Start development server
npm run dev
\`\`\`
*Backend will run on `http://localhost:5000`*

### 2. Frontend Setup
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
*Frontend will run on `http://localhost:5173`*

---

## 🐳 Docker Deployment (Production / Testing)

The easiest way to spin up the entire stack (Database, Backend API, Frontend Nginx Server) is using Docker.

1. Create a `.env` file in the root directory (or inject variables during runtime) containing your OpenAI Key:
   \`\`\`env
   OPENAI_API_KEY=sk-your-secret-key
   \`\`\`

2. Run Docker Compose:
   \`\`\`bash
   docker-compose up -d --build
   \`\`\`

3. **Access the application:**
   - Frontend UI: \`http://localhost:3000\`
   - Backend API: \`http://localhost:5000/health\`

To stop the containers:
\`\`\`bash
docker-compose down
\`\`\`

---

## 🧠 System Architecture Overview

- **RESTful Monolith Layer**: Clean layered architecture (`controllers` -> `services` -> `database`).
- **Authentication**: JWT sent via `Bearer` token in Authorization headers.
- **RAG Pipeline**: Standups are ingested into `LangChain` memory vector store, vectorized via `OpenAIEmbeddings`, and queried dynamically via a `ChatOpenAI` LLM prompt to identify exact progress and immediate bottlenecks.
