package com.kwfw.findiary.service.login;

import com.kwfw.findiary.common.ConstantCommon;
import com.kwfw.findiary.common.UtilKw;
import com.kwfw.findiary.config.ApplicationConfig;
import com.kwfw.findiary.mapper.login.LoginMapper;
import com.kwfw.findiary.model.UserInfoVO;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final LoginMapper loginMapper;

    public UserInfoVO login(UserInfoVO userInfoVO, HttpSession session) {
        UserInfoVO vo = loginMapper.login(userInfoVO);

        if (vo != null) {
            session.setAttribute(ConstantCommon.SESSION_LOGIN_USER, vo);

            // 세션 유효 시간 30분 설정
            session.setMaxInactiveInterval(UtilKw.minutesToSeconds(ApplicationConfig.sessionTimeout));
        }
        return vo;
    }
}
