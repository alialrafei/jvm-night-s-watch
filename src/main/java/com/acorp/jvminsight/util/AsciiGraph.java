package com.acorp.jvminsight.util;

public final class AsciiGraph {

    private AsciiGraph() {}

    public static String bar(long used, long max, int width) {
        if (max <= 0) return "";

        int filled = (int) ((double) used / max * width);
        return "[" +
                "#".repeat(Math.max(0, filled)) +
                " ".repeat(Math.max(0, width - filled)) +
                "]";
    }
}
