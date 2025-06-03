package com.kwfw.findiary.controller.api.diary;

import com.kwfw.findiary.common.ConstantCommon;
import com.kwfw.findiary.model.*;
import com.kwfw.findiary.service.bankAccount.BankAccountService;
import com.kwfw.findiary.service.diary.DiaryService;
import com.kwfw.findiary.service.holiday.HolidayService;
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
import java.util.Map;
import java.util.Objects;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/diary")
public class DiaryController {

    private final HolidayService holidayService;

    private final DiaryService diaryService;

    private final BankAccountService bankAccountService;

    @PostMapping("getHolidays")
    public ResponseEntity<List<HolidayDto>> getHolidays(@RequestBody HolidayVO holidayVO) {

        List<HolidayDto> holidays = holidayService.getHolidays(holidayVO);

        return ResponseEntity.ok(Objects.requireNonNullElse(holidays, Collections.emptyList()));
    }

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
    public ResponseEntity<Map<String, String>> insertTradingDiary(@RequestBody DiaryDto diaryDto) {
        return ResponseEntity.ok(diaryService.insertTradingDiary(diaryDto));
    }

    @PostMapping("/updateTradingDiary")
    public ResponseEntity<Boolean> updateTradingDiary(@RequestBody DiaryDto diaryDto) {
        return ResponseEntity.ok(diaryService.updateTradingDiary(diaryDto));
    }

    @PostMapping("/checkTradingMapping")
    public ResponseEntity<Boolean> checkTradingMapping(@RequestBody DiaryDto diaryDto) {
        return ResponseEntity.ok(diaryService.checkTradingMapping(diaryDto));
    }

    @PostMapping("/deleteTradingDiary")
    public ResponseEntity<Boolean> deleteTradingDiary(@RequestBody DiaryDto diaryDto) {
        return ResponseEntity.ok(diaryService.deleteTradingDiary(diaryDto));
    }
}