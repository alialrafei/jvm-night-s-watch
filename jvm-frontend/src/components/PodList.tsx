import React from "react";
import PodComponent from "./PodComponent";
import { CardList, Section , SectionCard } from "@blueprintjs/core";
import { JvmMonitorReport } from "src/constants/requestBody";
interface PodListProps {
    pods: JvmMonitorReport[];
}

const PodList = (props: PodListProps) => {
    const handlePodClick = (pod: string) => {
        console.log(`Clicked pod: ${pod}`);
    };

    return (

        <Section title="Pod List" className="w-64 bg-white border-r border-gray-300 overflow-y-auto">
            <SectionCard padded={false}>
                <CardList bordered={false}>
                    {props.pods.map((pods: JvmMonitorReport) => (
                    <PodComponent key={pods.jvmSnapshots[0].pid} pod={pods.pod.name}
                     onClick={()=> {handlePodClick(pods.pod.name)}} />
                 ))}
                </CardList>
            </SectionCard>
        </Section>
        
            
        
    );
};



export default PodList;