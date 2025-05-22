package com.kwfw.findiary.model;

import lombok.Data;

@Data
public class HoldingStockDto {
    private int holding_count;

    private float holding_price;

    private String ticker;
    private String stock_name;
    private String currency;
    private String account_num;
    private String status;
    private String descr;
    private String create_date;
    private String modify_date;
}
