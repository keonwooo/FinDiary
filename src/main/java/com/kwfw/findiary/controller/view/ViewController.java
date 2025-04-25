package com.kwfw.findiary.controller.view;

import com.kwfw.findiary.common.ConstantCommon;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping("/")
    public String index(HttpSession session) {
        String user = (String) session.getAttribute(ConstantCommon.SESSION_LOGIN_USER);
        if (user != null) {
            return "redirect:/dashboard";
        }
        return "login/login";
    }

    @GetMapping("/logout")
    public String logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate(); // 세션 전체 제거
        }
        return "redirect:/"; // 로그아웃 후 메인페이지 등으로
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "pages/dashboard";
    }

    @GetMapping("/diary")
    public String diary() {
        return "pages/diary";
    }
}