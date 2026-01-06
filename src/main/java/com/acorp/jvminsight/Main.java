package com.acorp.jvminsight;

import com.acorp.jvminsight.discovery.JvmProcessLocator;
import com.acorp.jvminsight.httpserver.HttpServerUtil;
import com.acorp.jvminsight.snapshotcollection.JvmCollector;

import java.util.List;

public class Main {

    public static void main(String[] args) throws Exception {

        List<Long> autoDetectTargetJvmPid;
        HttpServerUtil.StartHttpServer();
        autoDetectTargetJvmPid = JvmProcessLocator.autoDetectTargetJvmPid();
        for (long pid : autoDetectTargetJvmPid) {
            Thread t = new Thread(new JvmCollector(pid), "collector-" + pid);
            t.setDaemon(true);
            t.start();
        }
        Thread.currentThread().join();
    }

}
