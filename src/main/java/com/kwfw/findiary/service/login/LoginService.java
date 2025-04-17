package com.kwfw.findiary.service.login;

import com.kwfw.findiary.common.ConstantCommon;
import com.kwfw.findiary.mapper.login.LoginMapper;
import com.kwfw.findiary.model.ResponseVO;
import com.kwfw.findiary.model.UserInfoVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginService {
    private final Logger LOGGER = LoggerFactory.getLogger(LoginService.class);

    @Autowired
    private LoginMapper loginMapper;

    public ResponseVO login(UserInfoVO userInfoVO) {
        ResponseVO responseVO = new ResponseVO();

        UserInfoVO vo = loginMapper.login(userInfoVO);

        if (vo != null) {
            responseVO.setResponse_code(ConstantCommon.RESPONSE_CODE_SUCCESS);
            responseVO.setResponse_msg(ConstantCommon.RESPONSE_CODE_SUCCESS_STR);
            responseVO.setResponse_data(vo);
        } else {
            responseVO.setResponse_code(ConstantCommon.LOGIN_CODE_FAIL);
            responseVO.setResponse_msg(ConstantCommon.LOGIN_CODE_FAIL_STR);
        }
        return responseVO;
    }
}
