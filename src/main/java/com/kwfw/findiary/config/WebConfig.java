package com.kwfw.findiary.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoginCheckInterceptor())
                .addPathPatterns("/**") // 인터셉터 적용 경로
                .excludePathPatterns("/", "/login", "/logout", "/css/**", "/js/**", "/images/**"); // 로그인 없이 접근 가능한 경로
    }
}
