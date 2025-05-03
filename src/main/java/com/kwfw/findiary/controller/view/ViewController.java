package com.kwfw.findiary.controller.view;

import com.kwfw.findiary.common.ConstantCommon;
import com.kwfw.findiary.model.BankAccountDto;
import com.kwfw.findiary.model.UserInfoVO;
import com.kwfw.findiary.service.bankAccount.BankAccountService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@RequiredArgsConstructor
@Controller
public class ViewController {

    private final BankAccountService bankAccountService;

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
    public String diary(HttpSession session, Model model) {
        // get 로그인 정보
        UserInfoVO loginUserInfo = (UserInfoVO) session.getAttribute(ConstantCommon.SESSION_LOGIN_USER);

        // get 계좌 정보
        List<BankAccountDto> bankAccountList = bankAccountService.getSearchBankAccountNumList(loginUserInfo);

        model.addAttribute("bankAccountList", bankAccountList);
        return "pages/diary";
    }
}