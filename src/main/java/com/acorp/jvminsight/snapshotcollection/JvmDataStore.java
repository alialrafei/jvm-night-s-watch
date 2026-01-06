package com.acorp.jvminsight.snapshotcollection;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import com.acorp.jvminsight.snapshotcollection.dto.JvmSnapshot;

public final class JvmDataStore {
    public static final Map<Long,JvmSnapshot> SNAPSHOTS = new ConcurrentHashMap<>();
    private JvmDataStore(){}
}
