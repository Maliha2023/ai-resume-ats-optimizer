# AI Resume & ATS Optimizer Pro

A responsive, multi-industry single-page application for benchmarking candidate resumes against target job descriptions using the official `@google/genai` SDK.

## Key Features

- **Universal Multi-Industry Support**: Select from preset professions (**Software Engineering**, **Digital Marketing**, **Human Resources**, **Finance & Accounting**, **Healthcare**, **Graphic Design**) or specify any **Custom Industry / Role**.
- **Dynamic Demo Profiles**: One-click **Load Demo Data** switches realistic Job Description and Resume samples to match the selected profession.
- **AI Results Dashboard**:
  - **ATS Match Score Card** with circular progress ring and 4-axis breakdown (*Keyword Alignment*, *Experience Relevance*, *Quantified Impact*, *ATS Formatting*).
  - **Industry-Specific Missing Keywords** split into **Hard Skills** and **Soft Skills** pill badges with click-to-copy and placement guidance.
  - **Professional AI Improvement Suggestions** with priority/category filters and ready-to-copy rewrites.
  - **Tailored Interview Questions** with 3 role-specific prompts and expandable prep guides.
- **Notion / Linear-Inspired Light & Dark Mode**: High-contrast Light Mode default (`#F8FAFC` slate surface, `#2563EB` royal blue primary actions) with a persistent Light/Dark header toggle.
- **Privacy & Production Resilience**:
  - All Gemini API calls run exclusively through the server-side `/api/analyze` Express endpoint (`process.env.GEMINI_API_KEY`) with `Cache-Control: no-store` so API keys are never exposed in client bundles and resume text is never stored.
  - React Error Boundaries and structured error alerts gracefully handle missing API keys, HTTP 429 rate limits (with retry countdown), and transient service outages.

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment template and set your Gemini API key:
   ```bash
   cp .env.example .env
   # Edit .env and set GEMINI_API_KEY
   ```
3. Start the development server (port `3000`):
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   npm start
   ```

## Scripts

- `npm run dev` — Starts the Express + Vite middleware server on port `3000`.
- `npm run build` — Compiles the production Vite client bundle into `dist/`.
- `npm run lint` — Runs TypeScript strict type-checking (`tsc --noEmit`).
- `npx tsx --test src/utils/atsAnalyzer.test.ts` — Runs unit tests for validation, diagnostics, score normalization, and API error classification.
