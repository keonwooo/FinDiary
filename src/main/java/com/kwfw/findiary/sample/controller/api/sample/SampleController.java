package com.kwfw.findiary.sample.controller.api.sample;

import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/sample")
public class SampleController {

    private final Logger LOGGER = LoggerFactory.getLogger(SampleController.class);

    Gson GSON = new Gson();
}
