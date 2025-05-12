package com.kwfw.findiary.mapper.diary;

import com.kwfw.findiary.model.DiaryDto;
import com.kwfw.findiary.model.DiaryVO;
import com.kwfw.findiary.model.TradingMappingVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DiaryMapper {
    int insertTradingDiary(DiaryDto diaryDto);

    void insertTradingMapping(TradingMappingVO tradingMappingVO);

    int updateTradingDiary(DiaryDto diaryDto);

    int deleteTradingDiary(DiaryDto diaryDto);

    int getAlreadyMappedCount(int trading_num);

    List<DiaryDto> getUserDiary(DiaryVO diaryVO);

    List<DiaryDto> selectRemainingBuyOrders(DiaryDto diaryDto);
}
