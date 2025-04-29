package com.kwfw.findiary.config;

import com.kwfw.findiary.common.ConstantCommon;
import groovy.util.logging.Slf4j;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.servlet.HandlerInterceptor;

@lombok.extern.slf4j.Slf4j
@Slf4j
public class LoginInterceptor implements HandlerInterceptor {

    // 컨트롤러 실행 전
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {

        String requestURI = request.getRequestURI();
//        log.info("[interceptor] : {}", requestURI);
        HttpSession session = request.getSession();

        if (session == null || session.getAttribute(ConstantCommon.SESSION_LOGIN_USER) == null) {
            // 로그인 되지 않음
            log.info("[Unauthenticated Users Request]");

            //로그인으로 redirect
            response.sendRedirect("/");
            return false;
        }
        // 로그인 되어있을 떄
        return true;
    }

    // 컨트롤러 실행 후, 뷰 실행 전
//    @Override
//    public void postHandle(HttpServletRequest request, HttpServletResponse response, ModelAndView modelAndVilew throws Exception {
//        log.info("[interceptor] postHandle");
//    }

    // 뷰 실행 후
//    @Override
//    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
//        log.info("[interceptor] afterCompletion");
//    }
}