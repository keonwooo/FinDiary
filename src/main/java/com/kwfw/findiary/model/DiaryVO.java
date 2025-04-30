package com.kwfw.findiary.model;

import lombok.Data;

import java.util.List;

@Data
public class DiaryVO {
    private String search_userId;
    private String search_account_num;
    private String search_date;
    private List<String> search_selected_account_num;
}
