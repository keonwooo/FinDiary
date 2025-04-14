package com.kwfw.findiary.mapper.login;

import com.kwfw.findiary.model.UserInfoVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LoginMapper {
    UserInfoVO login(UserInfoVO userInfoVO);
}
