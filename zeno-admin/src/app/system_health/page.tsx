'use client';

import React from 'react';
import SystemHealthSection from './components/SystemHealthSection';
import DatabaseQuerySection from './components/DatabaseQuerySection';
import { useFetchRuns } from '../hooks/useFetchRuns';

export default function HealthDashboard() {
    const { data: runs, isLoading, error, fetchData } = useFetchRuns();

    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4 animate-spin"></div>
                    <p className="text-white text-base">Loading system health analytics...</p>
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="bg-red-600 text-white p-4 rounded-lg mb-4">
                        <h2 className="text-lg font-bold mb-2">Error</h2>
                        <p>Unknown error occurred.</p>
                        <button 
                            className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
                            onClick={fetchData}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    if (!runs || !Array.isArray(runs) || runs.length === 0) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center px-4">
                <div className="text-white text-center text-base">
                    Sorry, No data available
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white px-6">
            <SystemHealthSection runs={runs} />
            <DatabaseQuerySection runs={runs} />
        </div>
    );
}