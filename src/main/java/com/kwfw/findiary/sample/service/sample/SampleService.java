package com.kwfw.findiary.sample.service.sample;

import com.kwfw.findiary.sample.mapper.sample.SampleMapper;
import com.kwfw.findiary.sample.model.SampleVO;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SampleService {

    private SampleMapper SampleMapper;

    public SampleVO login(SampleVO userInfoVO, HttpSession session) {
//        SampleVO vo = SampleMapper.login(userInfoVO);
//
//        if (vo != null) {
//            session.setAttribute(ConstantCommon.SESSION_LOGIN_USER, vo);
//        }
//
//        return vo;
        return null;
    }
}
