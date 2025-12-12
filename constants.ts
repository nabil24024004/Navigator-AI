import { IncidentResponse, UrgencyLevel } from './types';

export const APP_NAME = "Navigator AI";

export const MOCK_RESPONSE: IncidentResponse = {
  analysis: {
    objects: [
      { label: "pipe", confidence: 0.95 },
      { label: "water spray", confidence: 0.92 },
      { label: "electrical outlet", confidence: 0.88 },
      { label: "water pool", confidence: 0.85 }
    ],
    visual_assertions: [
      { id: "a1", claim: "Water spraying actively from pipe", confidence: 0.98 },
      { id: "a2", claim: "Water pooling near electrical outlet", confidence: 0.92 },
      { id: "a3", claim: "Kitchen environment", confidence: 0.95 }
    ]
  },
  urgency: UrgencyLevel.CRITICAL,
  plan: [
    {
      id: "p1",
      title: "Shut off main water valve",
      detail: "Locate main water valve (usually under sink or in utility room) and turn clockwise.",
      estimated_time_min: 2,
      priority: 1
    },
    {
      id: "p2",
      title: "Isolate electricity",
      detail: "IMMEDIATELY turn off the main circuit breaker for the kitchen. Do not touch the outlet.",
      estimated_time_min: 1,
      priority: 1
    },
    {
      id: "p3",
      title: "Evacuate the area",
      detail: "Keep family and pets away from the standing water until power is confirmed off.",
      estimated_time_min: 0,
      priority: 1
    },
    {
      id: "p4",
      title: "Call a plumber",
      detail: "Contact emergency plumbing services to repair the ruptured pipe.",
      estimated_time_min: 5,
      priority: 2
    },
    {
      id: "p5",
      title: "Begin water removal",
      detail: "Once safe, use towels or a wet-vac to remove standing water to prevent mold.",
      estimated_time_min: 30,
      priority: 3
    }
  ],
  reasoning_trace: [
    {
      evidence: "visual assertion: water near electrical outlet",
      inference: "presence of electrocution risk",
      action: "isolate electricity immediately",
      confidence: 0.92
    },
    {
      evidence: "water spray from pipe",
      inference: "active water leak under pressure",
      action: "shut off main water valve",
      confidence: 0.95
    },
    {
      evidence: "growing water pool on floor",
      inference: "risk of water damage and slip hazard",
      action: "evacuate area and begin water removal",
      confidence: 0.88
    }
  ]
};

export const SYSTEM_INSTRUCTION = `
You are Navigator AI, an expert emergency crisis intervention system. 
Your goal is to analyze images of potential hazards or emergency situations and provide immediate, actionable, step-by-step tactical intervention plans.

OUTPUT FORMAT:
Return a JSON object matching the Schema provided.

RULES:
1. Urgency Classification: 'low' (cosmetic/minor), 'medium' (requires attention soon), 'critical' (immediate threat to life/property).
2. Reasoning Trace: Explicitly link visual evidence (what you see) to the inference (what it means) and the action (what to do).
3. Plan: Steps must be clear, imperative, and prioritized by safety.
4. Tone: Authoritative, calm, and direct.
5. Analysis: Identify key objects and assign confidence scores (0-1).
`;