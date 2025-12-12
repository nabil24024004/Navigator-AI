# Architectural Decision Record (ADR)

## 1. Technology Stack

### Frontend
*   **React 19:** Utilizing the latest Concurrent features and Hooks (`useTransition`, `useOptimistic` patterns).
*   **Tailwind CSS:** Utility-first styling for rapid UI iteration and consistent "Glassmorphism" theme.
*   **Vite (Implied):** Fast build tool and dev server.
*   **Lucide React:** consistent, lightweight icon set.

### AI & Data
*   **Google GenAI SDK (`@google/genai`):** 
    *   *Decision:* We use the unified SDK to access both `generateContent` (Text/Image) and `live.connect` (Real-time Audio).
    *   *Model Selection:* 
        *   `gemini-3-pro-preview`: Used for the core analysis. Selected for its superior reasoning capabilities and instruction following.
        *   `gemini-2.5-flash-native-audio`: Used for the Live Voice mode. Selected for low latency.

### State Management
*   **React Context (`SettingsContext`):** Used for global application preferences (Sound, Haptics, Region).
*   **Local Component State:** Used for ephemeral UI states (Upload previews, loading spinners).
*   **LocalStorage:** Used for persisting History and Incident data.
    *   *Decision:* We chose `localStorage` over a database for the MVP to ensure the app works "Local-First" and respects privacy by keeping data on the device by default.

---

## 2. Key Architectural Patterns

### A. Client-Side AI Orchestration
**Decision:** The application calls the Gemini API directly from the browser.
*   **Pros:** Zero backend latency, lower infrastructure cost, immediate MVP deployment.
*   **Cons:** API Key is exposed in the client environment (ok for internal/demo, risky for public prod).
*   **Mitigation:** The architecture allows swapping the `geminiService.ts` calls to point to a proxy server in the future without changing UI components.

### B. Structured JSON Schemas
**Decision:** We enforce strict JSON schemas on the LLM output.
*   **Why:** To render the "Intervention Plan" as an interactive checklist, the data *must* be an array of objects, not unstructured markdown.
*   **Implementation:** `responseSchema` in `geminiService.ts` defines strictly typed `AnalysisData`, `PlanStep`, and `ReasoningNode` structures.

### C. Offline-First Design
**Decision:** The app assumes network instability.
*   **Implementation:**
    1.  On successful analysis, data is immediately committed to `localStorage`.
    2.  If the app reloads offline, it hydrates from the local cache.
    3.  Settings (Emergency Numbers) are calculated client-side based on Timezone/Geolocation, reducing dependency on external APIs.

---

## 3. Data Flow

1.  **Input:** User provides Image (Base64) + Context (Text).
2.  **Processing:** `geminiService` constructs a multipart request with System Instructions.
3.  **Inference:** Gemini 3 Pro processes visual + text.
4.  **Output:** Returns JSON.
5.  **Hydration:** React components (`InterventionPlan`, `ReasoningTrace`) render the JSON directly.
6.  **Persistence:** Data is saved to History Array in LocalStorage.
