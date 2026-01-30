import React, { useEffect, useState } from 'react';
import PodList from "../components/PodList";
import { JvmMonitorReport } from "../constants/requestBody";
import { Button, Card, Navbar, Alignment,Spinner,EntityTitle ,BlueprintProvider, H1 } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

export default function App() {
    // Store reports in a Record (Dictionary) using pod name as the key
    const [reports, setReports] = useState<Record<string, JvmMonitorReport>>({});

    useEffect(() => {
        console.log("React: Component mounted, attaching listener...");

        const handleData = (data: JvmMonitorReport) => {
            console.log("React: SUCCESS! Data reached the component:", data);
            setReports((prevReports) => ({
                ...prevReports,
                [data.jvmSnapshots[0].pid]: data,
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
            <BlueprintProvider>
            <div className="flex flex-col items-center justify-items-start h-screen bg-gray-100">
            {Array.from({ length: 5 }).map((_, i) => (
                <EntityTitle ellipsize={true}
                            fill={true}    
                            icon={undefined}
                            loading={true}
                            heading={H1}
                            title="JVM Night's Watch" subtitle="No Pods Discovered Yet" />
            ))}
             <p className="text-gray-600 text-lg">Waiting for JVM Pods...</p>
             <Spinner size={25} className="mb-4" />            
            </div>
            </BlueprintProvider>
        );
    }

    return (
        <BlueprintProvider>
            <Navbar className="bp3-dark">
                <Navbar.Group align={Alignment.START}>
                    <Navbar.Heading>JVM Night's Watch</Navbar.Heading>
                    <Navbar.Divider />
                    <Button className="bp3-minimal" icon="home" text="Home" />
                </Navbar.Group>
            </Navbar>
            <MainContent podNames={Object.values(reports)} />
        </BlueprintProvider>
    );
}


function MainContent({ podNames }: { podNames: JvmMonitorReport[] }) {
    return (
        <div className="flex flex-row h-screen bg-gray-100">
            {/* Sidebar with all discovered pods */}
            <PodList pods={podNames} />

        </div>
    );
}