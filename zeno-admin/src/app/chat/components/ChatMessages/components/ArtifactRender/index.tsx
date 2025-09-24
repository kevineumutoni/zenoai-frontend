"use client";

import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import { Typography } from "@mui/material";

type ChartData = {
  x: (string | number)[];
  y: number[];
  title?: string;
  chart_type?: "bar" | "line" | "pie";
};

type TableData = {
  columns?: string[];
  rows?: (string | number)[][];
  x?: (string | number)[];
  y?: (string | number)[];
  title?: string;
};

type ArtifactRendererProps = {
  artifactType: "chart" | "table" | "text";
  artifactData: ChartData | TableData;
  text?: string;
};

export default function ChatArtifactRenderer({
  artifactType,
  artifactData,
  text,
}: ArtifactRendererProps) {
  if (artifactType === "chart")
    return <ChartRenderer data={artifactData as ChartData} />;
  if (artifactType === "table")
    return <TableRenderer data={artifactData as TableData} />;
  if (artifactType === "text")
    return (
      <p className=" max-w-[80%] whitespace-pre-wrap text-sm text-gray-900">
        {text}
      </p>
    );
  return null;
}

function ChartRenderer({ data }: { data: ChartData }) {
  if (!data?.x || !data?.y || !Array.isArray(data.x) || !Array.isArray(data.y)) {
    return (
      <div className="">
        <div className="p-2 rounded-lg bg-white shadow">
          <p className="text-xs text-gray-500">Invalid chart data</p>
          <pre className="text-[0.7rem] overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  const chartData: { label: string | number; value: number }[] = data.x.map(
    (xVal, idx) => ({
      label: xVal,
      value: data.y[idx] ?? 0,
    })
  );

  const chartType = data.chart_type || "line";

  return (
    <div className="  if (data?.x && data?.y) {
">
      <div className=" rounded-2xl shadow  max-w-[480px] w-full">
        {data.title && (
          <Typography
            variant="subtitle1"
            align="center"
            className="text-gray-900 mb-2 font-semibold"
          >
            {data.title}
          </Typography>
        )}

        {chartType === "bar" && (
          <div className="bg-white rounded-xl">
            <BarChart
              xAxis={[
                { data: chartData.map((d) => d.label), scaleType: "band" },
              ]}
              series={[
                { data: chartData.map((d) => d.value), color: "#60a5fa" },
              ]}
              width={400}
              height={220}
            />
          </div>
        )}

        {chartType === "line" && (
          <div className="bg-white rounded-xl">
            <LineChart
              xAxis={[{ data: chartData.map((d) => d.label) }]}
              series={[
                { data: chartData.map((d) => d.value), color: "#3b82f6" },
              ]}
              width={400}
              height={220}
            />
          </div>
        )}

        {chartType === "pie" && (
          <div className="bg-white rounded-xl">
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
          </div>
        )}
      </div>
    </div>
  );
}

function TableRenderer({ data }: { data: TableData }) {
  if (data?.x && data?.y) {
    return (
      <div className="">
        <div className="bg-wh rounded-2xl shadow p-4 max-w-[500px] overflow-x-auto">
          {data.title && (
            <p className="mb-2 text-blue-600 font-medium">{data.title}</p>
          )}
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="border-b font-bold p-1">Label</th>
                <th className="border-b font-bold p-1">Value</th>
              </tr>
            </thead>
            <tbody>
              {data.x.map((label, idx) => (
                <tr key={idx}>
                  <td className="border-b p-1">{label}</td>
                  <td className="border-b p-1">{data.y?.[idx]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!data?.columns || !data?.rows) return null;

  return (
    <div className="">
      <div className="bg-white rounded-2xl shadow p-4 max-w-[480px]  text-black overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              {data.columns.map((col, idx) => (
                <th key={idx} className="border-b font-bold p-1">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, idx) => (
              <tr key={idx}>
                {row.map((cell, cidx) => (
                  <td key={cidx} className="border-b p-1">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
