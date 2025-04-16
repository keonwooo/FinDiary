package com.kwfw.findiary.model;

import lombok.Data;

@Data
public class ResponseVO {
    private String responseCode;
    private String responseMsg;
    private Object responseData;
}
