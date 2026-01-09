import React from "react";
import PodComponent from "./PodComponent";

interface PodListProps {
    pods: string[];
}

const PodList = (props: PodListProps) => {
    const handlePodClick = (pod: string) => {
        console.log(`Clicked pod: ${pod}`);
    };

    return (
        <div className="flex flex-col">
            {props.pods.map((pod: string) => (
                <PodComponent pod={pod}
                onClick={()=> {handlePodClick(pod)}} />
            ))}
        </div>
    );
};



export default PodList;