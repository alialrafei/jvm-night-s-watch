package com.acorp.jvminsight.thread;

import java.util.EnumMap;
import java.util.Map;

public class ThreadSummary {

    public enum State {
        RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, UNKNOWN
    }

    private final Map<State, Integer> counts = new EnumMap<>(State.class);

    public ThreadSummary() {
        for (State s : State.values()) {
            counts.put(s, 0);
        }
    }

    public void inc(State s) {
        counts.put(s, counts.get(s) + 1);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("Thread Summary:\n");
        counts.forEach((k, v) -> sb.append("  ").append(k).append(": ").append(v).append('\n'));
        return sb.toString();
    }
}
