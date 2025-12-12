# AI Prompt Engineering Strategy

Navigator AI relies heavily on advanced prompt engineering to ensure safety, accuracy, and structured output.

## 1. System Instruction
The core persona is defined in `constants.ts`:

> "You are Navigator AI, an expert emergency crisis intervention system... Your goal is to analyze images... and provide immediate, actionable, step-by-step tactical intervention plans."

**Key Constraints Enforced:**
1.  **Tone:** Authoritative, Calm, Direct.
2.  **Format:** JSON only (enforced via Schema).
3.  **Safety:** Prioritizes life safety over property damage.

## 2. The "Reasoning Trace" (Chain of Thought)
To prevent hallucinations and increase user trust, we force the model to output a `reasoning_trace`.

**Structure:**
```json
{
  "evidence": "Visual observation (e.g., 'Smoke coming from outlet')",
  "inference": "Deduction (e.g., 'Electrical fire hazard')",
  "action": "Recommendation (e.g., 'Cut main power')",
  "confidence": 0.95
}
```
**Why this matters:**
This acts as an explicit Chain-of-Thought (CoT) prompting technique. By forcing the model to articulate *what* it sees before *what to do*, we significantly increase the accuracy of the final plan.

## 3. Urgency Classification
We utilize a 3-tier classification system mapped to UI states:

| Level | UI Color | Behavior |
|-------|----------|----------|
| **LOW** | Green | Info only. |
| **MEDIUM** | Yellow | Standard display. |
| **CRITICAL** | Red | Pulsing UI, Audio Alert, Haptic Feedback, Emergency Call Button visible. |

## 4. Model Configuration
*   **Model:** `gemini-3-pro-preview`
*   **Temperature:** Left at default (creative but grounded).
*   **Thinking Config:** `thinkingBudget: 1024`.
    *   *Note:* We enable "Thinking" tokens to allow the model to process complex scenes (e.g., a car crash with multiple hazards) before generating the JSON. This reduces the likelihood of missing secondary hazards (e.g., leaking fuel).
