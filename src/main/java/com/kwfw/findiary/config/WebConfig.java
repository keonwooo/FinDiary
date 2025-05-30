package com.kwfw.findiary.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoginInterceptor())
                .order(1)
                .addPathPatterns("/**")
                .excludePathPatterns(
                        "/"
                        , "/api/login/**"
                        , "/logout"
                        , "/css/**"
                        , "/fonts/**"
                        , "/images/**"
                        , "/js/**"
                        , "/lib/**");
    }
}
