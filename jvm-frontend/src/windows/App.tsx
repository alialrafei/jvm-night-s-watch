import React, { useEffect, useState , useContext ,createContext } from 'react';
import PodList from "../components/PodList";
import { JvmMonitorReport } from "../constants/requestBody";
import { Button, Card, Navbar, Alignment,Spinner,EntityTitle ,BlueprintProvider, H1   } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import PodMain from "./PodMain";


 interface PodDataContextType {
    reports :   Record<string, JvmMonitorReport>;
    selectedPodData: Record<string, JvmMonitorReport>;
    setSelectedPodData: React.Dispatch<React.SetStateAction<Record<string, JvmMonitorReport>>>;    
}

export const PodDataContext = createContext<PodDataContextType>({
    reports: {},
    selectedPodData: {},
    setSelectedPodData: () => {}
});

export default function App() {
    // Store reports in a Record (Dictionary) using pod name as the key
    const [reports, setReports] = useState<Record<string, JvmMonitorReport>>({});
    const [selectedPodData, setSelectedPodData] = useState<Record<string, JvmMonitorReport>>({});   
    
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

            <PodDataContext.Provider value={{ reports, selectedPodData, setSelectedPodData }}>

            <MainContent />

            </PodDataContext.Provider>  
            
        </BlueprintProvider>
    );
}


function MainContent() {
    
    return (
       <div className="flex flex-row h-screen" style={{ height: '100%' }}>
            {/* Sidebar with all discovered pods */}
            <div className="w-64 flex-shrink-0 overflow-y-auto bg-white border-r border-gray-300">
                <PodList />
            </div>
            {/* Main content area for selected pod details */}
            <div className="flex-1 overflow-hidden bg-gray-100">
                <PodMain />
            </div>
        </div>
    );
}