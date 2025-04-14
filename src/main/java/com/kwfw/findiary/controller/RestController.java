package com.kwfw.findiary.controller;

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
    private final Logger logger = LoggerFactory.getLogger(RestController.class);

    @Autowired
    private LoginService loginService;

    @ResponseBody
    @PostMapping("login")
    public String login(@RequestBody UserInfoVO userInfoVO) {
        logger.info("::: login Controller START :::");

        loginService.login(userInfoVO);

        logger.info("::: login Controller END :::");
        return null;
    }
}
