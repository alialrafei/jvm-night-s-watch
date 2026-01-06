package com.acorp.jvminsight.memory;

import javax.management.MBeanServerConnection;
import java.lang.management.GarbageCollectorMXBean;
import java.lang.management.ManagementFactory;
import java.util.ArrayList;
import java.util.List;

public final class GcCollector {

    private GcCollector() {}

    public static List<GcSnapshot> collect(MBeanServerConnection mbeanServer)
            throws Exception {

        List<GarbageCollectorMXBean> gcs =
                ManagementFactory.getPlatformMXBeans(
                        mbeanServer,
                        GarbageCollectorMXBean.class
                );

        List<GcSnapshot> result = new ArrayList<>();

        for (GarbageCollectorMXBean gc : gcs) {
            result.add(
                    new GcSnapshot(
                            gc.getName(),
                            gc.getCollectionCount(),
                            gc.getCollectionTime()
                    )
            );
        }

        return result;
    }
}
