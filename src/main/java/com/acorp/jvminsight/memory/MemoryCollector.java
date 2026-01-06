package com.acorp.jvminsight.memory;

import javax.management.MBeanServerConnection;
import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.MemoryUsage;

public final class MemoryCollector {

    private MemoryCollector() {}

    public static MemorySnapshot collect(MBeanServerConnection mbeanServer)
            throws Exception {

        MemoryMXBean memoryBean =
                ManagementFactory.newPlatformMXBeanProxy(
                        mbeanServer,
                        ManagementFactory.MEMORY_MXBEAN_NAME,
                        MemoryMXBean.class
                );

        MemoryUsage heap = memoryBean.getHeapMemoryUsage();
        MemoryUsage nonHeap = memoryBean.getNonHeapMemoryUsage();

        return new MemorySnapshot(
                heap.getUsed(),
                heap.getCommitted(),
                heap.getMax(),
                nonHeap.getUsed(),
                nonHeap.getCommitted()
        );
    }
}
