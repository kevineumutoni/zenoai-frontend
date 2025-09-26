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

export interface RunFile {
  file: File;
  previewUrl: string; 
}

export interface RunLike {
  id: number | string;
  user_input: string;
  status: string;
  final_output: string | null;
  output_artifacts: any[];
  started_at: string;
  _optimistic?: boolean;
  files?: RunFile[]; 
  error?: string;
}


export interface FileWithPreview {
  file: File;
  previewUrl: string;
}

export interface ChatInputProps {
  conversationId?: string | null;
  user?: { id: number; token: string };
  sendMessage: (params: {
    conversationId?: string | null;
    userInput: string;
    files?: File[];
    filePreviews?: { file: File; previewUrl: string }[];
  }) => Promise<RunLike>;
}

export interface UserMessageProps {
  text: string;
  files?: RunFile[];
}