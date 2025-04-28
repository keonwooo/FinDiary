package com.kwfw.findiary.model;

import lombok.Data;

@Data
public class BankAccountDto {
    private int account_property;

    private String account_num;
    private String account_name;
    private String user_id;
    private String currency;
    private String descr;
    private String create_date;
    private String modify_date;
}
