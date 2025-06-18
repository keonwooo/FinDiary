package com.kwfw.findiary.model;

import lombok.Data;

import java.util.Objects;

@Data
public class HolidayDto {
    private int status;

    private String date;  // yyyy-MM-dd
    private String localName;
    private String name;
    private String countryCode;

    private String holiday;
    private String country_code;
    private String year;
    private String month;
    private String descr;
    private String create_date;
    private String modify_date;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof HolidayDto that)) return false;
        return Objects.equals(date, that.date) &&
                Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(date, name);
    }
}
