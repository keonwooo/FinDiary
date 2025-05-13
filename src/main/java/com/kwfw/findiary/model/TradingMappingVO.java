package com.kwfw.findiary.model;

import lombok.Data;

@Data
public class TradingMappingVO {
    private int mapping_id;
    private int buy_trading_num;
    private int sell_trading_num;
    private int sell_count;
    private float sell_price;
    private float profit;
    private int status;

    private String currency;
    private String descr;
}