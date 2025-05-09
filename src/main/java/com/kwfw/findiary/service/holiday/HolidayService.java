package com.kwfw.findiary.service.holiday;

import com.kwfw.findiary.mapper.holiday.HolidayMapper;
import com.kwfw.findiary.model.HolidayDto;
import com.kwfw.findiary.model.HolidayVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HolidayService {

    private final HolidayMapper holidayMapper;

    public List<HolidayDto> getHolidays(HolidayVO holidayVO) {
        return holidayMapper.getHolidays(holidayVO);
    }
}
