import React , {useContext,useState} from "react";
import PodComponent from "./PodComponent";
import { CardList, Section , SectionCard } from "@blueprintjs/core";
import { JvmMonitorReport } from "../constants/requestBody";
import { PodDataContext } from "../windows/App";
import PodMain from "../windows/PodMain";


const PodList = () => {
    const podData = useContext(PodDataContext);
    const [selectedPod, setSelectedPod] = useState<string | null>(null);
    const handlePodClick = (pod: string) => {
        //Go to pod details page
        setSelectedPod(pod);
    };

    return (
        selectedPod ? <PodMain selectedId={selectedPod} /> : 
        <Section title="Pod List" className="w-64 bg-white border-r border-gray-300 overflow-y-auto">
            <SectionCard padded={false}>
                <CardList bordered={false}>
                    {Object.values(podData).map((pods: JvmMonitorReport) => (
                    <PodComponent key={pods.jvmSnapshots[0].pid} pod={pods.pod.name}
                     onClick={()=> {handlePodClick(pods.pod.name)}} />
                 ))}
                </CardList>
            </SectionCard>
        </Section>    
        
    );
};



export default PodList;