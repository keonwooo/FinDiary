package com.kwfw.findiary.model;

import lombok.Data;

@Data
public class BankAccountDto {
    private String account_num;
    private String account_name;
    private String user_id;
    private String descr;
    private String create_date;
    private String modify_date;
}
