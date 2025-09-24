"use client";

import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";

type ArtifactRendererProps = {
  artifactType: "chart" | "table" | "text";
  artifactData: any;
  text?: string;
};

export default function ChatArtifactRenderer({
  artifactType,
  artifactData,
  text,
}: ArtifactRendererProps) {
  if (artifactType === "chart")
    return <ChartRenderer data={artifactData} />;
  if (artifactType === "table")
    return <TableRenderer data={artifactData} />;
  if (artifactType === "text")
    return (
      <Typography
        variant="body2"
        sx={{
          whiteSpace: "pre-wrap",
          color: "text.primary",
          maxWidth: "80%",
        }}
      >
        {text}
      </Typography>
    );
  return null;
}

function ChartRenderer({ data }: { data: any }) {
  if (!data?.x || !data?.y || !Array.isArray(data.x) || !Array.isArray(data.y)) {
    return (
      <Box sx={{ ml: 6 }}>
        <Paper
          sx={{ p: 1, backgroundColor: "background.default", borderRadius: 2 }}
        >
          <Typography variant="caption" color="text.secondary">
            Invalid chart data
          </Typography>
          <pre style={{ fontSize: "0.7rem", overflowX: "auto" }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </Paper>
      </Box>
    );
  }

  const chartData = data.x.map((xVal: string | number, idx: number) => ({
    label: xVal,
    value: data.y[idx],
  }));

  const chartType = data.chart_type || "line";

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-start", ml: 6 }}>
      <Paper
        sx={{
          p: 2,
          backgroundColor: "#9FF8F8", 
          borderRadius: 3,
          maxWidth: 420,
          width: "100%",
        }}
      >
        {data.title && (
          <Typography
            variant="subtitle1"
            align="center"
            sx={{ mb: 2, color: "#0A1A2E" }} 
          >
            {data.title}
          </Typography>
        )}

        {chartType === "bar" && (
          <BarChart
            xAxis={[{ data: chartData.map((d) => d.label), scaleType: "band" }]}
            series={[{ data: chartData.map((d) => d.value), color: "#60a5fa" }]} 
            width={400}
            height={220}
          />
        )}
        {chartType === "line" && (
          <LineChart
            xAxis={[{ data: chartData.map((d) => d.label) }]}
            series={[{ data: chartData.map((d) => d.value), color: "#0A1A2E" }]} 
            width={400}
            height={220}
          />
        )}
        {chartType === "pie" && (
          <PieChart
            series={[
              {
                data: chartData.map((d, i) => ({
                  id: String(d.label),
                  value: d.value,
                  label: String(d.label),
                  color: ["#60a5fa", "#f472b6", "#a78bfa"][i % 3], 
                })),
              },
            ]}
            width={400}
            height={220}
          />
        )}
      </Paper>
    </Box>
  );
}

function TableRenderer({ data }: { data: any }) {
  if (!data?.columns || !data?.rows) {
    if (data?.x && data?.y) {
      return (
        <Box sx={{ ml: 6 }}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 3,
              backgroundColor: "#9FF8F8", 
              maxWidth: 400,
              overflowX: "auto",
            }}
          >
            {data.title && (
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, color: "#0284c7" }}
              >
                {data.title}
              </Typography>
            )}
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Label</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.x.map((label: string | number, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell>{label}</TableCell>
                    <TableCell>{data.y[idx]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      );
    }
    return null;
  }

  return (
    <Box sx={{ ml: 6 }}>
      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
          backgroundColor: "#f0f9ff",
          maxWidth: 400,
          overflowX: "auto",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              {data.columns.map((col: string, idx: number) => (
                <TableCell key={idx} sx={{ fontWeight: "bold" }}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.rows.map((row: any[], idx: number) => (
              <TableRow key={idx}>
                {row.map((cell, cidx) => (
                  <TableCell key={cidx}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
