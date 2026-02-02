// In PodMain.tsx
import React, { useContext } from 'react';
import { Section, SectionCard, CardList, Card } from "@blueprintjs/core";
import { PodDataContext } from "./App";

const PodMain = () => {
    const { reports, selectedPodData } = useContext(PodDataContext);
    
    console.log("PodMain render - selectedPodData:", selectedPodData);
    console.log("PodMain render - reports:", reports);

    if (!selectedPodData || Object.keys(selectedPodData).length === 0) {
        return (
            <Section title="Pod Details" className="flex-1 p-4 overflow-y-auto">
                <SectionCard padded={true} className="bg-white border border-gray-300">
                    <Card>No pod selected</Card>
                </SectionCard>
            </Section>
        );
    }

    const podData = Object.values(selectedPodData)[0];
    console.log("Rendering pod data:", podData);

    return (
        <Section title={`Details for Pod: ${podData.pod.name}`} className="flex-1 p-4 overflow-y-auto">
            <SectionCard padded={true} className="bg-white border border-gray-300">
                <CardList>
                    <Card>Memory: {podData.jvmSnapshots[0]?.memory?.heapUsed}</Card>
                    <Card>ThreadsInfo</Card>
                    <Card>GC</Card>
                    <Card>Memory Pools</Card>
                    <Card>Histograms</Card>
                    <Card>Deadlocks</Card>
                    <Card>Dump</Card>
                </CardList> 
            </SectionCard>
        </Section>
    );
}

export default PodMain;