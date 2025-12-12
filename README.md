# Navigator AI 🧭

**AI-powered emergency crisis navigator that reasons over photos/videos to provide immediate, actionable intervention plans.**

Navigator AI bridges the critical gap between an emergency event and professional response. By leveraging **Gemini 3 Pro**, it analyzes visual scenes in seconds to detect hazards, classify urgency, and generate tactical step-by-step checklists.

![Status](https://img.shields.io/badge/Status-MVP-success)
![AI](https://img.shields.io/badge/Powered%20By-Gemini%203%20Pro-blue)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Tailwind%20%7C%20Vite-blueviolet)

## ✨ Key Features

*   **📸 Multimodal Analysis:** Upload images or take photos directly. The system identifies objects, hazards, and environmental context.
*   **📝 Tactical Intervention Plans:** Converts chaotic situations into clear, prioritized checklists with estimated times for every step.
*   **🧠 Reasoning Trace:** A "Chain of Thought" UI that explains *why* the AI recommended specific actions, building user trust.
*   **🗣️ Live Voice Mode:** Real-time, low-latency voice conversation using `gemini-2.5-flash-native-audio` for hands-free assistance.
*   **🚨 Urgency Classification:** Automatic detection of Critical, Medium, or Low urgency states with appropriate UI alerts (visual/haptic/audio).
*   **💾 Offline-First:** Saves incident history locally and caches the active plan for reliable access in spotty network conditions.

## 🚀 Getting Started

### Prerequisites

*   Node.js 18+
*   A Google AI Studio API Key with access to `gemini-3-pro-preview` and `gemini-2.5-flash-native-audio-preview-09-2025`.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-org/navigator-ai.git
    cd navigator-ai
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure API Key**
    Set your API key in your environment variables.
    ```bash
    export API_KEY="your_google_ai_studio_key"
    ```
    *Note: In a local development environment using Vite/Webpack, you might need to use a `.env` file. Ensure `process.env.API_KEY` is accessible.*

4.  **Run the development server**
    ```bash
    npm start
    # or
    npm run dev
    ```

5.  **Open the app**
    Navigate to `http://localhost:3000` (or the port shown in your terminal).

## 📚 Documentation

Detailed documentation regarding the project roadmap, architecture, and AI implementation can be found in the `docs/` folder:

*   **[MVP Roadmap & Idea Inbox](docs/idea-inbox-mvp-roadmap.md)**: Current status and future features.
*   **[Architecture Decisions](docs/architecture.md)**: Tech stack, state management, and offline strategies.
*   **[Prompt Engineering](docs/ai-prompt-engineering.md)**: How we structure prompts, enforce JSON schemas, and use reasoning traces.

## 🛠️ Tech Stack

*   **Frontend:** React 19, TypeScript, Tailwind CSS
*   **Icons:** Lucide React
*   **AI SDK:** `@google/genai` (Unified SDK)
*   **Models:**
    *   Analysis: `gemini-3-pro-preview`
    *   Live Voice: `gemini-2.5-flash-native-audio-preview-09-2025`

## ⚠️ Safety Disclaimer

**Navigator AI is a guidance support tool.** It is **not** a replacement for professional emergency services (911/999/112). In life-threatening situations, always contact local authorities immediately.

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
