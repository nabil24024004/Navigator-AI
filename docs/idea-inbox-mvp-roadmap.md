# Navigator AI — MVP Roadmap & Inbox

## 1. Project Vision
**Navigator AI** is a multimodal crisis assistant designed to bridge the gap between an emergency event and professional response. By leveraging **Gemini 3 Pro**, it "reasons" over visual data (images/video) to provide immediate, calm, and tactically prioritized intervention plans.

**Core Value Proposition:**
1.  **Speed:** Instant analysis (<5s) of complex visual scenes.
2.  **Clarity:** Converts chaos into a checklist.
3.  **Transparency:** Shows the "Reasoning Trace" so users trust the AI's logic.

---

## 2. Status: What Works (Current MVP)
The current build is a fully functional **Progressive Web App (PWA) candidate**.

### ✅ Core Features
*   **Multimodal Ingestion:**
    *   Native Camera capture (implemented via `getUserMedia`).
    *   File upload (Drag & Drop).
    *   Voice Context input (Speech-to-Text).
*   **AI Analysis Loop:**
    *   Connects to **Gemini 3 Pro** (Preview).
    *   Returns structured JSON: Urgency Level, Plan Steps, Reasoning Trace.
    *   Displays confidence scores for object detection.
*   **Intervention UI:**
    *   Interactive checklist (optimistic UI updates).
    *   **Urgency Banner:** Visual/Haptic/Audio feedback based on severity.
    *   **Reasoning Trace:** Collapsible view of the AI's logic chain.
*   **Persistence:**
    *   **History System:** Saves incidents to `localStorage`.
    *   **Offline Settings:** Caches the last incident for viewing without signal.
*   **Gemini Live Integration:**
    *   Real-time voice conversation mode using `gemini-2.5-flash-native-audio`.
    *   Visualizer and audio output streaming.

---

## 3. Idea Inbox (Backlog)

### 🚀 High Priority (Next Sprint)
- [ ] **GPS Integration:** Use the `geolocation` coordinates captured in Settings to inject specific local emergency services (e.g., nearest hospital) into the prompt context.
- [ ] **PDF Export:** Allow users to download the Intervention Plan as a PDF to share with first responders.
- [ ] **PWA Manifest:** Finalize `manifest.json` and Service Workers to make the app installable on iOS/Android.

### 🔮 Future Horizons
- [ ] **Multi-Shot Video Analysis:** Analyze a 10-second video clip rather than a single frame for better temporal understanding (e.g., "Is the fire growing?").
- [ ] **User Accounts:** Sync history across devices (requires Supabase/Firebase backend).
- [ ] **First Responder Mode:** A specialized UI for off-duty medics that uses specialized medical terminology.

---

## 4. Known Limitations
1.  **Browser Compatibility:** The Live Voice feature relies on specific AudioContext APIs that may behave differently on iOS Safari vs Chrome Android.
2.  **API Key Exposure:** Currently client-side. For production, this must move to a proxy server (Next.js API route or Express).
