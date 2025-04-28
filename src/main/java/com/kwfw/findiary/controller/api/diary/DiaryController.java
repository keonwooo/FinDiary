package com.kwfw.findiary.controller.api.diary;

import com.google.gson.Gson;
import com.kwfw.findiary.common.ConstantCommon;
import com.kwfw.findiary.model.DiaryDto;
import com.kwfw.findiary.model.DiaryVO;
import com.kwfw.findiary.model.UserInfoVO;
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

    @PostMapping("/getUserDiaries")
    public ResponseEntity<List<DiaryDto>> getUserDiary(
            @RequestBody DiaryVO diaryVO,
            HttpSession session) {
        // 로그인 유저 정보
        UserInfoVO loginUserInfo = (UserInfoVO) session.getAttribute(ConstantCommon.SESSION_LOGIN_USER);
        DiaryDto diaryDto = new DiaryDto();

        List<DiaryDto> userDiaries = diaryService.getUserDiary(diaryVO);

        //            log.warn("유저 데이터가 없습니다. year={}, month={}", year, month);
        return ResponseEntity.ok(Objects.requireNonNullElse(userDiaries, Collections.emptyList()));
    }
}