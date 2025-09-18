
import { useState, useEffect } from 'react';
import { fetchRuns } from '../utils/fetchRuns';

export interface Run {
  id: number;
  conversation: number | null;
  user_input: string;
  final_output: string | null;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at: string | null;
  input_files: InputFile[];
  output_artifacts: OutputArtifact[];
}

export interface InputFile {
  id: number;
  run: number;
  file: string;
  file_type: 'pdf' | 'image' | 'text';
  description: string | null;
}

export interface ChartData {
  x: (string | number)[];
  y: number[];
  title?: string;
  chart_type?: string;
}

export interface TableData {
  rows: (string | number)[][];
  columns: string[];
}

export interface TextData {
  content: string;
  summary?: string;
}

export interface PdfReportData {
  url: string;
  pages?: number;
  generated_at?: string;
}
type ChartArtifact = {
  artifact_type: 'chart';
   data:ChartData;
};

type TableArtifact = {
  artifact_type: 'table';
   data:TableData;
};

type TextArtifact = {
  artifact_type: 'text';
   data:TextData;
};

type PdfReportArtifact = {
  artifact_type: 'pdf_report';
   data:PdfReportData;
};

export type OutputArtifact = {
  id: number;
  run: number;
  artifact_type: 'chart' | 'table' | 'text' | 'pdf_report';
  created_at: string;
  title: string | null;
} & (ChartArtifact | TableArtifact | TextArtifact | PdfReportArtifact);

export function useFetchRuns() {
  const [data, setData] = useState<Run[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function fetchData() {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchRuns();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return { data, fetchData, isLoading, error };
}