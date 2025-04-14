package com.kwfw.findiary.service.login;

import com.kwfw.findiary.mapper.login.LoginMapper;
import com.kwfw.findiary.model.UserInfoVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginService {
    private final Logger logger = LoggerFactory.getLogger(LoginService.class);

    @Autowired
    private LoginMapper loginMapper;

    public String login(UserInfoVO userInfoVO) {
        logger.info("::: login Service START :::");
        UserInfoVO vo = loginMapper.login(userInfoVO);


        logger.info("::: login Service END :::");
        return null;
    }
}
