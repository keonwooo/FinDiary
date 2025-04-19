package com.kwfw.findiary.controller.view;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping("/")
    public String index(HttpSession session) {
        String user = (String) session.getAttribute("login-user");
        if (user != null) {
            return "redirect:/dashboard";
        }
        return "login/login";
    }

    @GetMapping("/dashboard")
    public String dashboard(HttpSession session) {
        String user = (String) session.getAttribute("login-user");
        if (user == null) {
            return "redirect:/login";
        }

        return "dashboard/dashboard";
    }
}