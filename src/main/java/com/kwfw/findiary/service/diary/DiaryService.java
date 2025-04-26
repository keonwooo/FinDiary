package com.kwfw.findiary.service.diary;

import com.kwfw.findiary.mapper.diary.DiaryMapper;
import com.kwfw.findiary.mapper.login.LoginMapper;
import com.kwfw.findiary.model.DiaryDto;
import com.kwfw.findiary.model.DiaryVO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DiaryService {

    private DiaryMapper diaryMapper;

    public List<DiaryDto> getUserDiary(DiaryVO diaryVO) {
        List<DiaryDto> diaryDtoList = diaryMapper.getUserDiary(diaryVO);
        return diaryDtoList;
    }
}
