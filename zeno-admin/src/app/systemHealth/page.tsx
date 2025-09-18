'use client';

import React from 'react';
import SystemHealthSection from './components/SystemHealthSection';
import DatabaseQuerySection from './components/DatabaseQuerySection';
import { useFetchRuns } from '../hooks/useFetchRuns';

export default function Dashboard() {
  const { data: runs, isLoading, error } = useFetchRuns();

  if (isLoading) return <div className="text-white text-center p-6">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-6">{error.message}</div>;
  if (!runs || !Array.isArray(runs) || runs.length === 0) {
    return <div className="text-white text-center p-6">No data available</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <SystemHealthSection runs={runs} />
      <DatabaseQuerySection runs={runs} />
    </div>
  );
}