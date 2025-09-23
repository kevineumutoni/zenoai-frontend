'use client';
import React, { useState, useEffect } from "react";

interface CircleData {
  cx: string;
  cy: string;
  r: number;
}

interface LineData {
  x1: string;
  y1: string;
  x2: string;
  y2: string;
}

export default function Background() {
  const [circles, setCircles] = useState<CircleData[]>([]);
  const [lines, setLines] = useState<LineData[]>([]);

  useEffect(() => {
    const generatedCircles: CircleData[] = Array.from({ length: 50 }).map(() => ({
      cx: `${Math.random() * 100}%`,
      cy: `${Math.random() * 100}%`,
      r: Math.random() * 2 + 1,
    }));

    const generatedLines: LineData[] = Array.from({ length: 50 }).map(() => ({
      x1: `${Math.random() * 100}%`,
      y1: `${Math.random() * 100}%`,
      x2: `${Math.random() * 100}%`,
      y2: `${Math.random() * 100}%`,
    }));

    setCircles(generatedCircles);
    setLines(generatedLines);
  }, []);

  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%" data-testid="gradient-def">
          <stop offset="0%" stopColor="#00BFFF" />
          <stop offset="100%" stopColor="#0066CC" />
        </linearGradient>
      </defs>
      {circles.map(({ cx, cy, r }, i) => (
        <circle
          key={`bg-circle-${i}`}
          data-testid={`circle-${i}`}
          cx={cx}
          cy={cy}
          r={r}
          fill="url(#grad)"
          opacity={0.8}
        />
      ))}
      {lines.map(({ x1, y1, x2, y2 }, i) => (
        <line
          key={`bg-line-${i}`}
          data-testid={`line-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="url(#grad)"
          strokeWidth={0.5}
          opacity={0.3}
        />
      ))}
    </svg>
  );
}