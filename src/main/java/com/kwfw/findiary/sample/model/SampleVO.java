package com.kwfw.findiary.sample.model;

import lombok.Data;

@Data
public class SampleVO {
    private String user_id;
    private String user_name;
    private String user_password;
    private String descr;
    private String create_date;
    private String modify_date;
}