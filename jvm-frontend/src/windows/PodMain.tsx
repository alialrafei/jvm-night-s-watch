import React, { useContext, useState } from 'react';
import { Section, SectionCard, Card, Tabs, Tab, H5 } from "@blueprintjs/core";
import { PodDataContext } from "./App";
import MemoryDashboard from "../components/dashboard/MemoryDashboard";
import ThreadDashboard from "../components/dashboard/ThreadDashboard";
import GcDashboard from "../components/dashboard/GcDashboard";
import ClassHistogram from "../components/dashboard/ClassHistogram";

const PodMain = () => {
    const { selectedPodData } = useContext(PodDataContext);
    const [selectedTab, setSelectedTab] = useState<string>("overview");

    console.log("PodMain render - selectedPodData:", selectedPodData);

    if (!selectedPodData || Object.keys(selectedPodData).length === 0) {
        return (
            <Section title="Pod Details" className="flex-1 p-4 overflow-y-auto dark:text-gray-100">
                <SectionCard padded={true} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 transition-colors duration-200">
                    <Card className="dark:bg-gray-700 dark:text-gray-100">No pod selected</Card>
                </SectionCard>
            </Section>
        );
    }

    const report = Object.values(selectedPodData)[0];
    // Assuming we want to show the latest snapshot. 
    // If there are multiple, we might want a selector, but for now take the last one (or first if that's the latest).
    // Typically 0 is the one referenced in existing code: `podData.jvmSnapshots[0]`
    const snapshot = report.jvmSnapshots[0];

    if (!snapshot) {
        return (
            <Section title={`Details for Pod: ${report.pod.name}`} className="flex-1 p-4 overflow-y-auto dark:text-gray-100">
                <SectionCard padded={true} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 transition-colors duration-200">
                    <Card className="dark:bg-gray-700 dark:text-gray-100">No snapshot data available</Card>
                </SectionCard>
            </Section>
        );
    }

    return (
        <Section title={`Details for Pod: ${report.pod.name} (${report.pod.namespace})`} className="flex-1 p-4 overflow-y-auto h-full flex flex-col dark:text-gray-100">
            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-4 rounded-md shadow-sm h-full flex flex-col transition-colors duration-200">
                <div className="mb-4">
                    <H5 className="dark:text-gray-100">Node: {report.pod.node} | App: {report.pod.app}</H5>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">PID: {snapshot.pid} | Timestamp: {new Date(snapshot.timestamp).toLocaleString()}</p>
                </div>

                <Tabs
                    id="dashboard-tabs"
                    onChange={(newTab) => setSelectedTab(newTab as string)}
                    selectedTabId={selectedTab}
                    className="flex-1 flex flex-col"
                    renderActiveTabPanelOnly
                >
                    <Tab
                        id="overview"
                        title="Memory"
                        panel={<div className="pt-4"><MemoryDashboard snapshot={snapshot} /></div>}
                    />
                    <Tab
                        id="threads"
                        title="Threads"
                        panel={<div className="pt-4"><ThreadDashboard snapshot={snapshot} /></div>}
                    />
                    <Tab
                        id="gc"
                        title="Garbage Collection"
                        panel={<div className="pt-4"><GcDashboard snapshot={snapshot} /></div>}
                    />
                    <Tab
                        id="classes"
                        title="Class Histogram"
                        panel={<div className="pt-4"><ClassHistogram snapshot={snapshot} /></div>}
                    />
                </Tabs>
            </div>
        </Section>
    );
}

export default PodMain;