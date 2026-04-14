# 🚀 Nova: The Intelligent Workstream Assistant

*A Google Antigravity "Prompt Wars" Challenge Submission*

## 🎯 Chosen Vertical: Intelligent Workstream Assistant

For this challenge, I chose the **Intelligent Workstream Assistant** vertical. The goal was to build a proactive, context-aware AI assistant that helps developers and professionals manage tasks, synthesize information, and execute workflows seamlessly. 

Nova is not just a chat interface; she is designed with a **Context Engine** that understands the local environment (time, active projects, simulated tasks) to provide highly personalized and relevant responses.

---

## 🧠 Approach and Logic

### 1. Context-Aware Interventions
Unlike standard LLMs that rely solely on the prompt, Nova's logic is built on a **Context-First** architecture:
- Before any prompt is sent to the AI, the `contextEngine.ts` intercepts the request.
- It aggregates local device state (simulated metrics like active project, recent task statuses, datetime).
- This aggregated context is prepended as a hidden *System Instruction* to the Google Gemini model. 
- **Result:** The AI can make logical decisions based on what the user is *currently* doing, without the user needing to explicitly state it.

### 2. Premium Aesthetics & UI Validation
The UI is built with a focus on visual excellence:
- **Glassmorphism & Dark Mode:** Uses advanced CSS patterns with `framer-motion` for fluid, organic transitions.
- **Micro-animations:** Loading states, chat bubbles, and sidebar elements animate smoothly to create a "wow" factor, shifting away from generic templates.

### 3. Google Services Integration
Nova tightly integrates with **Google Gemini (1.5 Flash/Pro)** via the `@google/generative-ai` SDK.
- The prompt engineering maximizes Gemini's ability to parse JSON-structured context and return markdown-formatted, highly readable output.
- *Future Scope:* The architecture is designed to easily plug in Google Calendar APIs and Google Drive APIs by swapping the simulated blocks in `contextEngine.ts` with live SDK calls.

---

## ⚙️ How the Solution Works

1. **User Input:** The user types a request (e.g., "What should I focus on next?").
2. **Context Gathering:** The React application pulls live environmental simulated data.
3. **Prompt Composition:** The user prompt and JSON context are merged.
4. **Gemini Execution:** The `@google/generative-ai` service processes the prompt.
5. **Dynamic Rendering:** The response is streamed back and rendered using `react-markdown` within a premium glass-panel UI.

### Getting Started

1. Clone this repository (Single Branch).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```
4. Add your Gemini API Key to `.env`:
   ```env
   VITE_GEMINI_API_KEY=your_actual_key_here
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

---

## 📝 Assumptions Made
- **API Availability:** Assumes the evaluator has a valid Google Gemini API key to insert into the `.env` file for live testing.
- **Simulated Context:** Due to the scope constraints (and avoiding heavy OAuth setup for a < 1MB repo), the local context (calendar tasks, active projects) is currently simulated in `contextEngine.ts`. In a full production build, this module would authenticate with Google Workspace APIs.
- **Environment:** Designed for modern web browsers supporting backdrop-filter CSS properties.

---

### 🛡️ Evaluation Focus Areas Met
- **Code Quality:** Structured cleanly into `components`, `services`, and `utils`.
- **Security:** API keys are excluded from source control via `.gitignore`.
- **Efficiency:** Built with Vite and React for ultra-fast load times. The entire repository footprint is minimal (< 1MB).
- **Google Services:** Leverages Gemini natively and is architected specifically for Google Workspace integration.
