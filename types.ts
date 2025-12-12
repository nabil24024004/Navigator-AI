export enum UrgencyLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  CRITICAL = 'critical'
}

export interface DetectedObject {
  label: string;
  confidence: number;
}

export interface VisualAssertion {
  id: string;
  claim: string;
  confidence: number;
}

export interface AnalysisData {
  objects: DetectedObject[];
  visual_assertions: VisualAssertion[];
}

export interface PlanStep {
  id: string;
  title: string;
  detail: string;
  estimated_time_min: number;
  priority: number;
  completed?: boolean; // UI state
}

export interface ReasoningNode {
  evidence: string;
  inference: string;
  action: string;
  confidence: number;
}

export interface IncidentResponse {
  analysis: AnalysisData;
  urgency: UrgencyLevel;
  plan: PlanStep[];
  reasoning_trace: ReasoningNode[];
}

export interface IncidentState {
  id: string;
  imageUrl: string;
  contextText: string;
  response: IncidentResponse | null;
  timestamp: number;
}