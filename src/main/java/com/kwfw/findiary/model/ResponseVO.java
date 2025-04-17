package com.kwfw.findiary.model;

import lombok.Data;

@Data
public class ResponseVO {
    private String response_code;
    private String response_msg;
    private Object response_data;
}
