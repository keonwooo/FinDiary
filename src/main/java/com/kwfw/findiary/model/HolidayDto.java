package com.kwfw.findiary.model;

import lombok.Data;

import java.util.Objects;

@Data
public class HolidayDto {
    private String date;  // yyyy-MM-dd
    private String localName;
    private String name;
    private String countryCode;

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
