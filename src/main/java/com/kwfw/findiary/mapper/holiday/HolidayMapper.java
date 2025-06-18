package com.kwfw.findiary.mapper.holiday;

import com.kwfw.findiary.model.HolidayDto;
import com.kwfw.findiary.model.HolidayVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Set;

@Mapper
public interface HolidayMapper {
    void deleteAll(String country_code);

    void saveAll(Set<HolidayDto> holidays);

    List<HolidayDto> getHolidays(HolidayVO holidayVO);

    HolidayDto checkCreateDate();
}
