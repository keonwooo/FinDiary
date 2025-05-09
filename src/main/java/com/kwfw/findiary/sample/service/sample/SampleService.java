package com.kwfw.findiary.sample.service.sample;

import com.kwfw.findiary.sample.model.SampleVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SampleService {

    public List<SampleVO> login(SampleVO userInfoVO) {
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
