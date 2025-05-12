package com.kwfw.findiary.service.diary;

import com.kwfw.findiary.common.ConstantCommon;
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

    public boolean updateTradingDiary(DiaryDto diaryDto) {
        boolean result = true;

        String tradingType = diaryDto.getTrading_type();
//        if (tradingType.equals(ConstantCommon.TRADING_TYPE_BUY)) {
//            // 매수
//            result = diaryMapper.updateTradingDiary(diaryDto) > 0;
//        } else {
//            // 매도
//        }

        result = diaryMapper.updateTradingDiary(diaryDto) > 0;


        return result;
    }

    public boolean deleteTradingDiary(DiaryDto diaryDto) {
        return diaryMapper.deleteTradingDiary(diaryDto) > 0;
    }
}
