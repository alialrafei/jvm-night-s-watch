package com.acorp.jvminsight.discovery;

import java.util.List;
import java.util.Optional;

public final class JvmProcessLocator {

    private JvmProcessLocator() {}

    public static List<Long> autoDetectTargetJvmPid() {

       
        Optional<Long> explicit = readPidFromEnv();
        if (explicit.isPresent()) {
            return List.of(explicit.get());
        }

        long selfPid = ProcessHandle.current().pid();

        List<JvmCandidate> candidates =
                ProcessHandle.allProcesses()
                        .filter(ProcessHandle::isAlive)
                        .filter(p -> isJavaProcess(p))
                        .map(JvmCandidate::new)
                        .toList();

        return JvmSelector.selectTargetJvm(candidates, selfPid);
    }

    private static boolean isJavaProcess(ProcessHandle p) {
        return p.info().command()
                .map(cmd -> cmd.contains("java"))
                .orElse(false);
    }

    private static Optional<Long> readPidFromEnv() {
        try {
            String value = System.getenv("TARGET_JVM_PID");
            if (value != null && !value.isBlank()) {
                return Optional.of(Long.parseLong(value));
            }
        } catch (Exception ignored) {}
        return Optional.empty();
    }
}
