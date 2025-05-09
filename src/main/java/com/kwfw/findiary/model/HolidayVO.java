package com.kwfw.findiary.model;

import lombok.Data;

import java.util.List;

@Data
public class HolidayVO {
    private String date;  // yyyy-MM-dd
    private String local_name;
    private String name;
    private String country_code;

    private List<String> country_codes;
    private List<HolidayDto> holidays;
}
