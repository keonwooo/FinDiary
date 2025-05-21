package com.kwfw.findiary.model;

import lombok.Data;

import java.util.List;

@Data
public class BankAccountDto {
    private int status;
    private String account_num;
    private String account_name;
    private String user_id;
    private String descr;
    private String create_date;
    private String modify_date;

    private float account_total_property;
    private String currency;



    private List<DiaryDto> diaryList;
}
