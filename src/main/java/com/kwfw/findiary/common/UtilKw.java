package com.kwfw.findiary.common;

import org.springframework.transaction.interceptor.TransactionAspectSupport;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

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

    public static String convertCurrency(String currency) {
        String currencyChar = "";
        if (currency.equals("dollar")) {
            return "$";
        } else if (currency.equals("won")) {
            return "₩";
        }
        return currencyChar;
    }

    public static boolean isBeforeToday(String date) {
        // 1. 문자열 -> LocalDateTime 파싱
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime targetDateTime = LocalDateTime.parse(date, formatter);

        // 2. 오늘 날짜 가져오기
        LocalDate today = LocalDate.now();  // 시스템 날짜 기준

        // 3. 비교 (LocalDate 비교)
        return targetDateTime.toLocalDate().isBefore(today);
    }
}
