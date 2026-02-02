import React, { useContext, useState } from "react";
import PodComponent from "./PodComponent";
import { CardList, Section, SectionCard } from "@blueprintjs/core";
import { JvmMonitorReport } from "../constants/requestBody";
import { PodDataContext } from "../windows/App";



const PodList = () => {
    const { reports, selectedPodData, setSelectedPodData } = useContext(PodDataContext);

    const handlePodClick = (pod: string) => {
        //Go to pod details page
        console.log(pod);
        const podData = reports[pod];
        setSelectedPodData({ [pod]: podData });
        console.log(podData.pod.name);
    };


    return (
        <Section title="Pod List" className="h-full bg-transparent dark:text-gray-100">
            <SectionCard padded={false}>
                <CardList bordered={false}>
                    {Object.values(reports).map((pods: JvmMonitorReport) => (
                        <PodComponent
                            key={pods.jvmSnapshots[0]?.pid}
                            pod={pods.pod.name}
                            onClick={() => handlePodClick(pods.jvmSnapshots[0]?.pid.toString())}
                        />
                    ))}
                </CardList>
            </SectionCard>
        </Section>
    );



};



export default PodList;