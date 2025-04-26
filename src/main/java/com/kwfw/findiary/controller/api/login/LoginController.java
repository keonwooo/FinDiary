package com.kwfw.findiary.controller.api.login;

import com.google.gson.Gson;
import com.kwfw.findiary.common.ConstantCommon;
import com.kwfw.findiary.model.ResponseVO;
import com.kwfw.findiary.model.UserInfoVO;
import com.kwfw.findiary.service.login.LoginService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/login")
public class LoginController {

    private final Logger LOGGER = LoggerFactory.getLogger(LoginController.class);

    Gson GSON = new Gson();

    private final LoginService loginService;

    @PostMapping("login-check")
    public @ResponseBody String login(@RequestBody UserInfoVO userInfoVO, HttpSession session) {
        UserInfoVO loginUserInfo = loginService.login(userInfoVO, session);

        ResponseVO responseVO = new ResponseVO();

        if (loginUserInfo != null) {
            responseVO.setResponse_code(ConstantCommon.RESPONSE_CODE_SUCCESS);
            responseVO.setResponse_msg(ConstantCommon.RESPONSE_CODE_SUCCESS_STR);
            responseVO.setResponse_data(loginUserInfo);
        } else {
            responseVO.setResponse_code(ConstantCommon.LOGIN_CODE_FAIL);
            responseVO.setResponse_msg(ConstantCommon.LOGIN_CODE_FAIL_STR);
        }

        return GSON.toJson(responseVO);
    }
}
