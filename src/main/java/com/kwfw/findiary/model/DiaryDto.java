package com.kwfw.findiary.model;

import lombok.Data;

@Data
public class DiaryDto {
    private String ticker;
    private String stock_name;
    private String trading_count;
    private String trading_type;
    private String trading_price;
    private String currency;
    private String trading_date;
    private String account_num;
    private String descr;
    private String create_date;
    private String modify_date;
}
