import React, { useEffect, useState } from 'react';
import PodList from "../components/PodList";
import { JvmMonitorReport } from "../constants/requestBody";

export default function App() {
    // Store reports in a Record (Dictionary) using pod name as the key
    const [reports, setReports] = useState<Record<string, JvmMonitorReport>>({});

    useEffect(() => {
        console.log("React: Component mounted, attaching listener...");

        const handleData = (data: JvmMonitorReport) => {
            console.log("React: SUCCESS! Data reached the component:", data);
            setReports((prevReports) => ({
                ...prevReports,
                [data.pod.name]: data,
            }));
        };

        if (window.electronAPI && window.electronAPI.onJvmData) {
            window.electronAPI.onJvmData(handleData);
        } else {
            console.error("React: window.electronAPI is missing or malformed");
        }
        }, []);

    const podNames = Object.keys(reports);

    if (podNames.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <div className="animate-pulse">Waiting for JVM snapshots...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-row h-screen bg-gray-100">
            {/* Sidebar with all discovered pods */}
            <PodList pods={podNames} />
            
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p>Select a pod from the list to see JVM metrics.</p>
                {/* You could add a 'selectedPod' state to show specific report data here */}
            </main>
        </div>
    );
}