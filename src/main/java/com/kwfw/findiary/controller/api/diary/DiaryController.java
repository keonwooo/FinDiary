package com.kwfw.findiary.controller.api.diary;

import com.google.gson.Gson;
import com.kwfw.findiary.common.ConstantCommon;
import com.kwfw.findiary.model.BankAccountDto;
import com.kwfw.findiary.model.DiaryDto;
import com.kwfw.findiary.model.DiaryVO;
import com.kwfw.findiary.model.UserInfoVO;
import com.kwfw.findiary.service.bankAccount.BankAccountService;
import com.kwfw.findiary.service.diary.DiaryService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/diary")
public class DiaryController {

    Gson GSON = new Gson();

    private final DiaryService diaryService;

    private final BankAccountService bankAccountService;

    @PostMapping("/getUserDiaries")
    public ResponseEntity<List<DiaryDto>> getUserDiary(@RequestBody DiaryVO diaryVO) {

        List<DiaryDto> userDiaries = diaryService.getUserDiary(diaryVO);

        return ResponseEntity.ok(Objects.requireNonNullElse(userDiaries, Collections.emptyList()));
    }

    @PostMapping("/getUserBankAccountNumList")
    public ResponseEntity<List<BankAccountDto>> getUserBankAccountNumList(HttpSession session) {
        UserInfoVO loginUserInfo = (UserInfoVO) session.getAttribute(ConstantCommon.SESSION_LOGIN_USER);

        List<BankAccountDto> bankAccountList = bankAccountService.getSearchBankAccountNumList(loginUserInfo);

        return ResponseEntity.ok(Objects.requireNonNullElse(bankAccountList, Collections.emptyList()));
    }

    @PostMapping("/getUserBankAccountNum")
    public ResponseEntity<BankAccountDto> getUserBankAccountNum(@RequestBody BankAccountDto dto, HttpSession session) {
        UserInfoVO loginUserInfo = (UserInfoVO) session.getAttribute(ConstantCommon.SESSION_LOGIN_USER);
        dto.setUser_id(loginUserInfo.getUser_id());

        BankAccountDto bankAccount = bankAccountService.getUserBankAccountNum(dto);

        return ResponseEntity.ok(bankAccount);
    }

    @PostMapping("/insertTradingDiary")
    public ResponseEntity<Boolean> insertTradingDiary(@RequestBody DiaryDto diaryDto) {
        return ResponseEntity.ok(diaryService.insertTradingDiary(diaryDto));
    }
}