package com.kwfw.findiary.config;

import com.kwfw.findiary.common.ConstantCommon;
import com.kwfw.findiary.mapper.holiday.HolidayRepository;
import com.kwfw.findiary.model.HolidayDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Component
@Transactional
@RequiredArgsConstructor
public class HolidayInitializer {

    private final HolidayRepository holidayRepository;

    @EventListener(ApplicationReadyEvent.class)
    public void initializeHolidays() {
        final int currentYear = LocalDate.now().getYear();
        final int startYear = currentYear - 5;
        final int endYear = currentYear + 5;
        final String[] countryCodes = {ConstantCommon.COUNTRY_CODE_KOREA, ConstantCommon.COUNTRY_CODE_US};

        RestTemplate restTemplate = new RestTemplate();

        // 기존 공휴일 삭제
        for (String countryCode : countryCodes) {
            Set<HolidayDto> allHolidays = new HashSet<>();
            int errorCount = 0;

            holidayRepository.deleteAll(countryCode);
            log.info("기존 {} 공휴일 데이터 삭제 완료", countryCode);

            for (int year = startYear; year <= endYear; year++) {
                String url = String.format("https://date.nager.at/api/v3/PublicHolidays/%d/%s", year, countryCode);

                try {
                    ResponseEntity<HolidayDto[]> response = restTemplate.getForEntity(url, HolidayDto[].class);
                    HolidayDto[] body = response.getBody();

                    if (response.getStatusCode().is2xxSuccessful() && body != null) {
                        List<HolidayDto> holidays = Arrays.asList(body);
                        allHolidays.addAll(holidays);
                    } else {
                        log.warn("공휴일 응답 실패 또는 데이터 없음: 연도={}, 상태={}", year, response.getStatusCode());
                        errorCount++;
                    }
                } catch (Exception ex) {
                    log.error("공휴일 API 호출 실패: 연도={}", year, ex);
                    errorCount++;
                }

                if (errorCount > 15) {
                    log.error("공휴일 API 오류 횟수 초과로 중단");
                    break;
                }
            }

            // 일괄 저장
            if (!allHolidays.isEmpty()) {
                holidayRepository.saveAll(allHolidays);
                log.info("{}, 총 공휴일 {}건 저장 완료", countryCode, allHolidays.size());
            } else {
                log.warn("저장할 공휴일 데이터가 없습니다.");
            }
        }
    }
}
