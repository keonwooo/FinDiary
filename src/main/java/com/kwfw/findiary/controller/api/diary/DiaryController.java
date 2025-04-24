package com.kwfw.findiary.controller.api.diary;

import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/diary")
public class DiaryController {

    private final Logger LOGGER = LoggerFactory.getLogger(DiaryController.class);

    Gson GSON = new Gson();
}
