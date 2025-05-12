package com.kwfw.findiary.model;

import lombok.Data;

@Data
public class DiaryDto {
    private int trading_num;
    private int trading_count;
    private int status;

    private long trading_price;

    private String ticker;
    private String stock_name;
    private String trading_type;
    private String currency;
    private String trading_date;
    private String account_num;
    private String descr;
    private String create_date;
    private String modify_date;
}
