package com.acorp.jvminsight.httpserver;

import com.acorp.jvminsight.httpserver.controller.AggregatorController;
import com.acorp.jvminsight.httpserver.service.SidecarPushService;

public final class SidecarPushScheduler {
    
    private static final long PUSH_INTERVAL_MS = 5500;

    public static void start(){
        Thread t = new Thread(() -> {
            while (true) {
                try {
                    Thread.sleep(PUSH_INTERVAL_MS);
                    String json = SidecarPushService.buildSnapshotJson();
                    // System.out.println("=================================PAYLOAD=================================");
                    // System.out.print(json);
                    AggregatorController.push(json);
                
                } catch (Exception e) {
                   e.printStackTrace();
                }
            }
        });
        t.setDaemon(true);
        t.start();
    }
}
