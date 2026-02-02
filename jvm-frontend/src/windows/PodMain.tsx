import React, { useEffect, useState ,useContext } from 'react';
import { JvmMonitorReport } from "../constants/requestBody";
import { Button,CardList, Card, Navbar, Alignment,Spinner,EntityTitle ,BlueprintProvider, H1 } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { PodDataContext } from "./App";




const PodMain = (props: { selectedId: string }) => {
    // Store reports in a Record (Dictionary) using pod name as the key
    const podData = useContext(PodDataContext);
    
    const [selectedPodData, setSelectedPodData] = useState<Record<string, JvmMonitorReport>>({});   
    
    useEffect(() => {
        if (props.selectedId && podData[props.selectedId]) {
            setSelectedPodData({ [props.selectedId]: podData[props.selectedId] });
        }
    }, [props.selectedId, podData]);

    return(
       <CardList>
            <Card>Memory</Card>
            <Card>ThreadsInfo</Card>
            <Card>GC</Card>
            <Card>Memory Pools</Card>
            <Card>Histograms</Card>
            <Card>Deadlocks</Card>
            <Card>Dump</Card>
        </CardList> 
       );
}

export default PodMain;