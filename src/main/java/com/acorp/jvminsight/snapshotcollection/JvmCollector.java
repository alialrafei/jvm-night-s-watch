package com.acorp.jvminsight.snapshotcollection;

import java.io.IOException;
import java.lang.management.ManagementFactory;
import java.lang.management.ThreadInfo;
import java.lang.management.ThreadMXBean;
import java.time.LocalDateTime;
import java.util.List;

import javax.management.InstanceNotFoundException;
import javax.management.MBeanException;
import javax.management.MBeanServerConnection;
import javax.management.MalformedObjectNameException;
import javax.management.ObjectName;
import javax.management.ReflectionException;

import com.acorp.jvminsight.attach.JvmAttachClient;
import com.acorp.jvminsight.memory.GcCollector;
import com.acorp.jvminsight.memory.GcSnapshot;
import com.acorp.jvminsight.memory.MemoryCollector;
import com.acorp.jvminsight.memory.MemoryPoolCollector;
import com.acorp.jvminsight.memory.MemoryPoolSnapshot;
import com.acorp.jvminsight.memory.MemorySnapshot;
import com.acorp.jvminsight.memory.histogram.ClassHistogramEntry;
import com.acorp.jvminsight.memory.histogram.HistogramParser;
import com.acorp.jvminsight.snapshotcollection.dto.JvmSnapshot;
import com.acorp.jvminsight.thread.ThreadDumpService;
import com.acorp.jvminsight.util.AsciiGraph;

public class JvmCollector implements Runnable {

    private final long pid;
    private final MBeanServerConnection mbeanServer;
    private static final long SAMPLE_INTERVAL_MS = 5000;

    public JvmCollector(long pid) {
        this.pid = pid;
        this.mbeanServer = JvmAttachClient.attachAndGetMBeanServer(pid);
    }

    @Override
    public void run() {
        while (true) {
            try {
                JvmSnapshot snapshot = new JvmSnapshot();
                // System.out.println("Target JVM PID: " + pid);
                // System.out.println("\n===== THREADS =====");
                String dump = "";
                try {
                    dump = ThreadDumpService.dumpAllThreads(mbeanServer);
                } catch (Exception e) {

                    e.printStackTrace();
                }
                // System.out.println(dump);
                snapshot.setDump(dump);
                snapshot.setPid(pid);
                long[] deadlocks = null;
                try {
                    deadlocks = ThreadDumpService.findDeadlockedThreads(mbeanServer);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                snapshot.setDeadlocks(deadlocks);
                // DEAD LOCK DETECTION
                if (deadlocks != null && deadlocks.length > 0) {
                    // System.out.println("🚨 DEADLOCKS DETECTED 🚨");

                    ThreadMXBean threadMXBean = null;
                    try {
                        threadMXBean = ManagementFactory.newPlatformMXBeanProxy(mbeanServer,
                                ManagementFactory.THREAD_MXBEAN_NAME, ThreadMXBean.class);
                    } catch (IOException e) {

                        e.printStackTrace();
                    }

                    ThreadInfo[] infos = threadMXBean.getThreadInfo(deadlocks, true, true);
                    snapshot.setThreadsInfos(infos);
                    // for (ThreadInfo info : infos) {
                    //     System.out.println(info.toString());
                    // }
                } else {
                    // System.out.println("No deadlocks detected.");
                }

                // System.out.println("\n===== MEMORY =====");
                MemorySnapshot mem = null;
                try {
                    mem = MemoryCollector.collect(mbeanServer);
                } catch (Exception e) {

                    e.printStackTrace();
                }
                snapshot.setMemory(mem);
                // System.out.println("Heap:");
                // System.out.println(AsciiGraph.bar(mem.heapUsed, mem.heapMax, 40) + " " + mb(mem.heapUsed) + "MB / "
                //         + mb(mem.heapMax) + "MB");

                // System.out.println("Non-Heap:");
                // System.out.println(mb(mem.nonHeapUsed) + "MB / " + mb(mem.nonHeapCommitted) + "MB");

                // System.out.println("\n--- Memory Pools ---");
                List<MemoryPoolSnapshot> pools = List.of();
                try {
                    pools = MemoryPoolCollector.collect(mbeanServer);
                } catch (Exception e) {

                    e.printStackTrace();
                }
                snapshot.setPools(pools);
                // for (MemoryPoolSnapshot pool : pools) {
                //     System.out.printf("%-25s %6dMB / %6dMB%n", pool.name, mb(pool.used), mb(pool.max));
                // }

                // System.out.println("\n--- Garbage Collectors ---");
                List<GcSnapshot> gcs = List.of();
                try {
                    gcs = GcCollector.collect(mbeanServer);
                } catch (Exception e) {

                    e.printStackTrace();
                }
                snapshot.setGc(gcs);
                // for (GcSnapshot gc : gcs) {
                //     System.out.printf("%-25s count=%d time=%dms%n", gc.name, gc.collectionCount,
                //             gc.collectionTimeMillis);
                // }

                try {
                    Thread.sleep(SAMPLE_INTERVAL_MS);
                } catch (InterruptedException e) {

                    e.printStackTrace();
                }

                ObjectName dcmd = null;
                try {
                    dcmd = new ObjectName("com.sun.management:type=DiagnosticCommand");
                } catch (MalformedObjectNameException e) {
                    e.printStackTrace();
                }
                String[] arggumentStrings = new String[] { "-all" }; // include unreachable if desired
                String histogram = "";
                try {
                    histogram = (String) mbeanServer.invoke(dcmd, "gcClassHistogram", new Object[] { arggumentStrings },
                            new String[] { "[Ljava.lang.String;" });
                } catch (InstanceNotFoundException e) {
                    e.printStackTrace();
                } catch (MBeanException e) {

                    e.printStackTrace();
                } catch (ReflectionException e) {

                    e.printStackTrace();
                } catch (IOException e) {

                    e.printStackTrace();
                }

                // System.out.println(histogram);
                List<ClassHistogramEntry> classesHistogram = HistogramParser.parse(histogram);
                classesHistogram = HistogramParser.sortByBytesDesc(classesHistogram).stream().limit(50).toList();
                
                snapshot.setHistogram(classesHistogram);
                snapshot.setTimestamp(System.currentTimeMillis());
                
                JvmDataStore.SNAPSHOTS.put(pid, snapshot);

                Thread.sleep(5000);

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private static long mb(long bytes) {
        return bytes <= 0 ? 0 : bytes / 1024 / 1024;
    }
}
