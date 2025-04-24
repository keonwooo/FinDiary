package com.kwfw.findiary.model;

import lombok.Data;

@Data
public class HolidayDto {
    private String date;  // yyyy-MM-dd
    private String localName;
    private String name;
    private String countryCode;
}
