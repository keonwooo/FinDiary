package com.kwfw.findiary.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ApplicationConfig {

    // 세션 타임 (분)
    @Value("${kw.setting.session-time}")
    public static int sessionTimeout;
}