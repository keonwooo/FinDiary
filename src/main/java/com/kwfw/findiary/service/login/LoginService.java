package com.kwfw.findiary.service.login;

import com.kwfw.findiary.common.ConstantCommon;
import com.kwfw.findiary.mapper.login.LoginMapper;
import com.kwfw.findiary.model.UserInfoVO;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    @Autowired
    private LoginMapper loginMapper;

    public UserInfoVO login(UserInfoVO userInfoVO, HttpSession session) {
        UserInfoVO vo = loginMapper.login(userInfoVO);

        if (vo != null) {
            session.setAttribute(ConstantCommon.SESSION_LOGIN_USER, vo);
        }

        return vo;
    }
}
