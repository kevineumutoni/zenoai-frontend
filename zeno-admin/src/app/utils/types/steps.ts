export interface Step {
  step_id: number;
  conversation: number;
  step_order: number;
  type: 'thought' | 'tool_call' | 'observation' | 'sub_agent_call';
  content: {
    message?: string;
    text?: string;
    params?: { [key: string]: any };
    function?: string;
    data?: Array<{
      source: string;
      content: string;
      created_at: string;
      embedding_id: number;
    }>;
    source?: string;
  };
  tool: null | any;
  agent: number | null;
  created_at: string; 
}