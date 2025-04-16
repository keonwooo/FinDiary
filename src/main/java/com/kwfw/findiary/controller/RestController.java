package com.kwfw.findiary.controller;

import com.google.gson.Gson;
import com.kwfw.findiary.model.ResponseVO;
import com.kwfw.findiary.model.UserInfoVO;
import com.kwfw.findiary.service.login.LoginService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@org.springframework.web.bind.annotation.RestController
@RequestMapping("api")
public class RestController {

    private final Logger LOGGER = LoggerFactory.getLogger(RestController.class);

    Gson GSON = new Gson();

    @Autowired
    private LoginService loginService;

    @PostMapping("login")
    public @ResponseBody String login(@RequestBody UserInfoVO userInfoVO) {
        ResponseVO responseVO = loginService.login(userInfoVO);

        return GSON.toJson(responseVO);
    }
}
