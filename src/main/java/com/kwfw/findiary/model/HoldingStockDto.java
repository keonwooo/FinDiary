package com.kwfw.findiary.model;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Data
public class HoldingStockDto implements Cloneable {
    private int holding_count;

    private float holding_total_price;
    private float holding_average_price;

    private String ticker;
    private String stock_name;
    private String currency;
    private String account_num;
    private int status;
    private String descr;
    private String create_date;
    private String modify_date;

    @Override
    public HoldingStockDto clone() {
        try {
            return (HoldingStockDto) super.clone();
        } catch (CloneNotSupportedException e) {
            log.error(e.getMessage());
        }
        return null;
    }
}
