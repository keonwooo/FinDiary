package com.kwfw.findiary.common;

public class ConstantCommon {
    // response success code
    public static final String RESPONSE_CODE_SUCCESS = "0000";
    public static final String RESPONSE_CODE_SUCCESS_STR = "SUCCESS";

    // login error code
    public static final String LOGIN_CODE_FAIL = "1000";
    public static final String LOGIN_CODE_FAIL_STR = "Check id or password";

    // session ID
    public static final String SESSION_LOGIN_USER = "login-user";

    // 국가 코드
    public static final String COUNTRY_CODE_KOREA = "KR";
    public static final String COUNTRY_CODE_US = "US";

    // trading type
    public static final String TRADING_TYPE_SELL = "sell";
    public static final String TRADING_TYPE_BUY = "buy";

    // ANSI 색상 코드
    public static final String ANSI_RED = "\u001B[31m";
    public static final String ANSI_GREEN = "\u001B[32m";
    public static final String ANSI_BLUE = "\u001B[34m";
    public static final String ANSI_RESET = "\u001B[0m";

    // 매매 일지 error code
    public static final String NO_MONEY = "1001";
    public static final String NOT_ENOUGH_MONEY = "1002";
    public static final String NOT_ENOUGH_HOLDING_STOCK = "1003";

    public static final String NO_MONEY_STR = "보유 자산 없음";
    public static final String NOT_ENOUGH_MONEY_STR = "보유 자산 부족";
    public static final String NOT_ENOUGH_HOLDING_STOCK_STR = "매도 수량 부족";
}