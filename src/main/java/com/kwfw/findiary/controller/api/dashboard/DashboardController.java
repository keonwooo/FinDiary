package com.kwfw.findiary.controller.api.dashboard;

import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/dashboard")
public class DashboardController {

    private final Logger LOGGER = LoggerFactory.getLogger(DashboardController.class);

    Gson GSON = new Gson();
}
