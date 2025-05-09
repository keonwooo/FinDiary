package com.kwfw.findiary.mapper.holiday;

import com.kwfw.findiary.model.HolidayDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.Set;

@Mapper
public interface HolidayRepository {
    void deleteAll(String country_code);

    void saveAll(Set<HolidayDto> holidays);
}
