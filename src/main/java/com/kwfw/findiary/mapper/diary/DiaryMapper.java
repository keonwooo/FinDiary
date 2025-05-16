package com.kwfw.findiary.mapper.diary;

import com.kwfw.findiary.model.DiaryDto;
import com.kwfw.findiary.model.DiaryVO;
import com.kwfw.findiary.model.TradingMappingVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DiaryMapper {
    void insertTradingMapping(TradingMappingVO tradingMappingVO);

    void deleteTradingMapping(DiaryDto diaryDto);

    int insertTradingDiary(DiaryDto diaryDto);

    int updateTradingDiary(DiaryDto diaryDto);

    int checkTradingMapping(DiaryDto diaryDto);

    int deleteTradingDiary(DiaryDto diaryDto);

    int getAlreadyMappedCount(int trading_num);

    List<DiaryDto> getUserDiary(DiaryVO diaryVO);

    List<DiaryDto> selectRemainingBuyOrders(DiaryDto diaryDto);
}
