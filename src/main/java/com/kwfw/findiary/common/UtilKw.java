package com.kwfw.findiary.common;

import org.springframework.transaction.interceptor.TransactionAspectSupport;

public class UtilKw {
    // 밀리초 → 초
    public static int millisToSeconds(int millis) {
        return millis / 1000;
    }

    // 밀리초 → 분
    public static int millisToMinutes(int millis) {
        return millis / (1000 * 60);
    }

    // 초 → 밀리초
    public static int secondsToMillis(int seconds) {
        return seconds * 1000;
    }

    // 분 → 밀리초
    public static int minutesToMillis(int minutes) {
        return minutes * 60 * 1000;
    }

    // 초 → 분
    public static int secondsToMinutes(int seconds) {
        return seconds / 60;
    }

    // 분 → 초
    public static int minutesToSeconds(int minutes) {
        return minutes * 60;
    }

    public static void rollback() {
        TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
    }
}
