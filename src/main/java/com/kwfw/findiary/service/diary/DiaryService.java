package com.kwfw.findiary.service.diary;

import com.kwfw.findiary.mapper.diary.DiaryMapper;
import com.kwfw.findiary.model.DiaryDto;
import com.kwfw.findiary.model.DiaryVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DiaryService {

    private final DiaryMapper diaryMapper;

    public List<DiaryDto> getUserDiary(DiaryVO diaryVO) {
        return diaryMapper.getUserDiary(diaryVO);
    }

    public boolean insertTradingDiary(DiaryDto diaryDto) {
        return diaryMapper.insertTradingDiary(diaryDto) > 0;
    }
}
