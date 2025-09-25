export type ChatMessagesProps = {
  runs: any[];
  onRetry?: (run: any) => void;
  userId?: number;
};


export type Run = {
  id: number;
  user_input: string;
  status: "pending" | "completed" | "failed";
  final_output?: string;
  output_artifacts?: any[];
  files?: File[]; 
};


export type ChatMessageProps = {
  role: "user" | "agent";
  text?: string;
  artifactType?: "text" | "chart" | "table";
  artifactData?: any;
  loading?: boolean;
  runId?: string | number;
  userId?: number;
};


export type TableData = {
  columns?: string[];
  rows?: (string | number)[][];
  x?: (string | number)[];
  y?: (string | number)[];
  title?: string;
};


export  type ChartData = {
  x: (string | number)[];
  y: number[];
  title?: string;
  chart_type?: "bar" | "line" | "pie";
};


export type ArtifactRendererProps = {
  artifactType: "chart" | "table" | "text";
  artifactData: ChartData | TableData;
  text?: string;
};


