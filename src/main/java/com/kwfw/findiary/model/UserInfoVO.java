package com.kwfw.findiary.model;

import lombok.Data;

@Data
public class UserInfoVO {
    private String user_id;
    private String user_name;
    private String user_password;
    private String descr;
    private String create_date;
    private String modify_date;
}