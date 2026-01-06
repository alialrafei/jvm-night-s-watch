package com.acorp.jvminsight.thread;

public final class ThreadDumpParser {

    private ThreadDumpParser() {}

    public static ThreadSummary summarize(String dump) {
        ThreadSummary summary = new ThreadSummary();

        for (String line : dump.split("\n")) {
            if (line.contains("java.lang.Thread.State:")) {
                if (line.contains("RUNNABLE")) summary.inc(ThreadSummary.State.RUNNABLE);
                else if (line.contains("BLOCKED")) summary.inc(ThreadSummary.State.BLOCKED);
                else if (line.contains("TIMED_WAITING")) summary.inc(ThreadSummary.State.TIMED_WAITING);
                else if (line.contains("WAITING")) summary.inc(ThreadSummary.State.WAITING);
                else summary.inc(ThreadSummary.State.UNKNOWN);
            }
        }
        return summary;
    }
}
