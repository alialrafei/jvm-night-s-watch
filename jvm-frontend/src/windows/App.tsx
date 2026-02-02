import React, { useEffect, useState, createContext } from 'react';
import PodList from "../components/PodList";
import { JvmMonitorReport } from "../constants/requestBody";
import { Button, Navbar, Alignment, Spinner, EntityTitle, BlueprintProvider, H1 } from "@blueprintjs/core";
import PodMain from "./PodMain";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";

interface PodDataContextType {
    reports: Record<string, JvmMonitorReport>;
    selectedPodData: Record<string, JvmMonitorReport>;
    setSelectedPodData: React.Dispatch<React.SetStateAction<Record<string, JvmMonitorReport>>>;
}

export const PodDataContext = createContext<PodDataContextType>({
    reports: {},
    selectedPodData: {},
    setSelectedPodData: () => { }
});

function ThemeToggle() {
    const { isDarkMode, toggleTheme } = useTheme();
    return (
        <Button
            minimal
            icon={isDarkMode ? "flash" : "moon"}
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        />
    );
}

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
            <ThemeProvider>
                <BlueprintProvider>
                    <div className="flex flex-col items-center justify-items-start h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
                        <div className="absolute top-4 right-4">
                            <ThemeToggle />
                        </div>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <EntityTitle
                                key={i}
                                ellipsize={true}
                                fill={true}
                                icon={undefined}
                                loading={true}
                                heading={H1}
                                title="JVM Night's Watch" subtitle="No Pods Discovered Yet" />
                        ))}
                        <p className="text-gray-600 dark:text-gray-400 text-lg">Waiting for JVM Pods...</p>
                        <Spinner size={25} className="mb-4" />
                    </div>
                </BlueprintProvider>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider>
            <BlueprintProvider>

                <Navbar>
                    <Navbar.Group align={Alignment.START}>
                        <Navbar.Heading>JVM Night's Watch</Navbar.Heading>
                        <Navbar.Divider />
                        <Button minimal icon="home" text="Home" />
                    </Navbar.Group>
                    <Navbar.Group align={Alignment.END}>
                        <ThemeToggle />
                    </Navbar.Group>
                </Navbar>

                <PodDataContext.Provider value={{ reports, selectedPodData, setSelectedPodData }}>
                    <MainContent />
                </PodDataContext.Provider>

            </BlueprintProvider>
        </ThemeProvider>
    );
}


function MainContent() {
    return (
        <div className="flex flex-row h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200" style={{ height: '100%' }}>
            {/* Sidebar with all discovered pods */}
            <div className="w-64 flex-shrink-0 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 transition-colors duration-200">
                <PodList />
            </div>
            {/* Main content area for selected pod details */}
            <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
                <PodMain />
            </div>
        </div>
    );
}