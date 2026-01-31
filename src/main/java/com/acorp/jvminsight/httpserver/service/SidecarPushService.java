package com.acorp.jvminsight.httpserver.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.acorp.jvminsight.container.dto.AggregatorSnapshot;
import com.acorp.jvminsight.container.dto.PodInfo;
import com.acorp.jvminsight.snapshotcollection.JvmDataStore;
import com.acorp.jvminsight.snapshotcollection.dto.JvmSnapshot;
import com.fasterxml.jackson.databind.ObjectMapper;

public final class SidecarPushService {
    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final PodInfo POD_INFO = loadFromEnv();
    private SidecarPushService(){}
    public static String buildSnapshotJson() throws Exception {
        AggregatorSnapshot aggregatorSnapshot  = new AggregatorSnapshot();
        List<JvmSnapshot> snapshots = new ArrayList<>();
        JvmDataStore.SNAPSHOTS.forEach((key,value)->{
                    snapshots.add(value);
             }
        );
        aggregatorSnapshot.setJvmSnapshots(snapshots);
        aggregatorSnapshot.setTime(System.currentTimeMillis());
        
        aggregatorSnapshot.setPod(SidecarPushService.getInfoFromEnv());

        return MAPPER.writeValueAsString(aggregatorSnapshot);
    }
    public static PodInfo getInfoFromEnv(){
      return POD_INFO;
    }
    
    public static PodInfo loadFromEnv(){
        //dummy data for now 
        PodInfo pod = new PodInfo();
        pod.setApp("order-service");
        pod.setNamespace("ecommerce");
        pod.setNode("12203");
        pod.setName("order-service-UID");
        return pod;
    }

}
