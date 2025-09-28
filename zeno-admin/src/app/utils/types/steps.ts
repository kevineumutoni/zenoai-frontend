export interface StepContentData {
  source: string;
  content: string;
  created_at: string;
  embedding_id: number;
}

export interface StepContent {
  message?: string;
  text?: string;
  params?: { [key: string]: unknown };
  function?: string;
  data?: Array<StepContentData>;
  source?: string;
}

export interface Step {
  step_id: number;
  conversation: number;
  step_order: number;
  type: 'thought' | 'tool_call' | 'observation' | 'sub_agent_call';
  content: StepContent;
  tool: null | Record<string, unknown>;
  agent: number | null;
  created_at: string;
}