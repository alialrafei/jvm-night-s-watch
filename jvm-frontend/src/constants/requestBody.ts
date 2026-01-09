export interface JvmMonitorReport {
  pod: PodMetadata;
  time: number;
  jvmSnapshots: JvmSnapshot[];
}

export interface PodMetadata {
  name: string;
  namespace: string;
  node: string;
  app: string;
}

export interface JvmSnapshot {
  pid: number;
  threadsInfos: ThreadInfo[];
  memory: MemoryMetrics;
  gc: GcStats[];
  pools: MemoryPool[];
  histogram: ClassHistogramEntry[];
  timestamp: number;
  dump: string;
  deadlocks: number[];
}

export interface ThreadInfo {
  threadName: string;
  threadId: number;
  blockedTime: number;
  blockedCount: number;
  waitedTime: number;
  waitedCount: number;
  lockName: string | null;
  lockOwnerId: number;
  lockOwnerName: string | null;
  daemon: boolean;
  inNative: boolean;
  suspended: boolean;
  threadState: "RUNNABLE" | "BLOCKED" | "WAITING" | "TIMED_WAITING" | "NEW" | "TERMINATED";
  priority: number;
  stackTrace: StackFrame[];
  lockedMonitors: LockedMonitor[];
  lockedSynchronizers: any[]; // Adjust if you have a specific structure for synchronizers
  lockInfo: LockInfo | null;
}

export interface StackFrame {
  classLoaderName: string | null;
  moduleName: string | null;
  moduleVersion: string | null;
  methodName: string;
  fileName: string | null;
  lineNumber: number;
  nativeMethod: boolean;
  className: string;
}

export interface LockedMonitor {
  className: string;
  identityHashCode: number;
  lockedStackFrame: StackFrame;
  lockedStackDepth: number;
}

export interface LockInfo {
  className: string;
  identityHashCode: number;
}

export interface MemoryMetrics {
  timestamp: number;
  heapUsed: number;
  heapCommitted: number;
  heapMax: number;
  nonHeapUsed: number;
  nonHeapCommitted: number;
}

export interface GcStats {
  name: string;
  collectionCount: number;
  collectionTimeMillis: number;
}

export interface MemoryPool {
  name: string;
  used: number;
  committed: number;
  max: number;
}

export interface ClassHistogramEntry {
  className: string;
  instances: number;
  bytes: number;
}