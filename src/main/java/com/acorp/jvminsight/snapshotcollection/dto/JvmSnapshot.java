package com.acorp.jvminsight.snapshotcollection.dto;

import java.lang.management.ThreadInfo;
import java.time.LocalDateTime;
import java.util.List;

import com.acorp.jvminsight.memory.GcSnapshot;
import com.acorp.jvminsight.memory.MemoryPoolSnapshot;
import com.acorp.jvminsight.memory.MemorySnapshot;

public class JvmSnapshot {
    public  long pid;
    public  ThreadInfo[] threadsInfos;
    public  MemorySnapshot memory;
    public  List<GcSnapshot> gc;
    public  List<MemoryPoolSnapshot> pools;
    public  String histogram;
    public  LocalDateTime timestamp;
    public  String dump ;
   
    public long[] deadlocks;
    
    public JvmSnapshot() {
    }
    public long getPid() {
        return pid;
    }
    public ThreadInfo[] getThreadsInfos() {
        return threadsInfos;
    }
    public MemorySnapshot getMemory() {
        return memory;
    }
    public List<GcSnapshot> getGc() {
        return gc;
    }
    public List<MemoryPoolSnapshot> getPools() {
        return pools;
    }
    public String getHistogram() {
        return histogram;
    }
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    public void setPid(long pid) {
        this.pid = pid;
    }
    public void setThreadsInfos(ThreadInfo[] threadsInfos) {
        this.threadsInfos = threadsInfos;
    }
    public void setMemory(MemorySnapshot memory) {
        this.memory = memory;
    }
    public void setGc(List<GcSnapshot> gc) {
        this.gc = gc;
    }
    public void setPools(List<MemoryPoolSnapshot> pools) {
        this.pools = pools;
    }
    public void setHistogram(String histogram) {
        this.histogram = histogram;
    }
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    public void setDump(String dump) {
        this.dump = dump;
    }
    public void setDeadlocks(long[] deadlocks) {
        this.deadlocks = deadlocks;
    }
  
}
