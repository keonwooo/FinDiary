package com.kwfw.findiary.controller.api.home;

import com.google.gson.Gson;
import com.kwfw.findiary.controller.api.login.LoginController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/home")
public class HomeController {

    private final Logger LOGGER = LoggerFactory.getLogger(LoginController.class);

    Gson GSON = new Gson();
}
