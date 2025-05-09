package com.kwfw.findiary.controller.api.dashboard;

import com.kwfw.findiary.model.QuotesVO;
import com.kwfw.findiary.service.dashboard.DashboardService;
import groovy.util.logging.Slf4j;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @PostMapping("/getQuotes")
    public ResponseEntity<List<QuotesVO>> getQuotes() {

        List<QuotesVO> userDiaries = dashboardService.getQuotes();

        return ResponseEntity.ok(Objects.requireNonNullElse(userDiaries, Collections.emptyList()));
    }
}
