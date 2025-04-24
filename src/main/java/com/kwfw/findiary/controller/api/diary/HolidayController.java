package com.kwfw.findiary.controller.api.diary;

import com.kwfw.findiary.model.HolidayDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/holidays")
public class HolidayController {

    @GetMapping("/{year}/{country}")
    public ResponseEntity<List<HolidayDto>> getHolidays(@PathVariable int year, @PathVariable String country) {
        String url = String.format("https://date.nager.at/api/v3/PublicHolidays/%d/%s", year, country);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<HolidayDto[]> response = restTemplate.getForEntity(url, HolidayDto[].class);

        return ResponseEntity.ok(Arrays.asList(Objects.requireNonNull(response.getBody())));
    }
}