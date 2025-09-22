package com.kwfw.findiary.controller.api.diary;

import com.kwfw.findiary.model.HolidayDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/holidays")
public class HolidayController {

    @GetMapping
    public ResponseEntity<List<HolidayDto>> getHolidays(
            @RequestParam("country") String country,
            @RequestParam("year") int year
    ) {
        log.info("getHolidays: {}, {}", country, year);
        String url = String.format("https://date.nager.at/api/v3/PublicHolidays/%d/%s", year, country);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<HolidayDto[]> response = restTemplate.getForEntity(url, HolidayDto[].class);

        HolidayDto[] body = response.getBody();
        if (body == null) {
            log.warn("공휴일 데이터가 없습니다. country={}, year={}", country, year);
            return ResponseEntity.ok(Collections.emptyList());
        }

        return ResponseEntity.ok(Arrays.asList(body));
    }
}