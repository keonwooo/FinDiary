package com.kwfw.findiary.sample.controller.api.sample;

import com.kwfw.findiary.sample.model.SampleVO;
import com.kwfw.findiary.sample.service.sample.SampleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("api/sample")
public class SampleController {

    private final SampleService sampleService;

    @PostMapping("/getSample")
    public ResponseEntity<List<SampleVO>> sample(@RequestBody SampleVO sampleVO) {

        List<SampleVO> sample = sampleService.login(sampleVO);

        return ResponseEntity.ok(Objects.requireNonNullElse(sample, Collections.emptyList()));
    }
}
