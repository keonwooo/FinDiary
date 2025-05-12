package com.kwfw.findiary.service.diary;

import com.kwfw.findiary.common.ConstantCommon;
import com.kwfw.findiary.mapper.diary.DiaryMapper;
import com.kwfw.findiary.model.DiaryDto;
import com.kwfw.findiary.model.DiaryVO;
import com.kwfw.findiary.model.TradingMappingVO;
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
        boolean result = true;

        String tradingType = diaryDto.getTrading_type();
        if (!tradingType.equals(ConstantCommon.TRADING_TYPE_BUY)) {
            // 매도
            List<DiaryDto> buyOrders = diaryMapper.selectRemainingBuyOrders(diaryDto);

            int remainingSellCount = diaryDto.getTrading_count();

            for (DiaryDto buyOrder : buyOrders) {
                int buyRemaining = buyOrder.getTrading_count()
                        - diaryMapper.getAlreadyMappedCount(buyOrder.getTrading_count());

                int useCount = Math.min(remainingSellCount, buyRemaining);

                if (useCount > 0) {
                    int tradingNum = diaryMapper.insertTradingDiary(diaryDto);

                    TradingMappingVO insertTradingVO = getTradingMappingVO(diaryDto, buyOrder, tradingNum);

                    diaryMapper.insertTradingMapping(insertTradingVO);

                    remainingSellCount -= useCount;
                }

                if (remainingSellCount == 0) break;
            }
        }

        return diaryMapper.insertTradingDiary(diaryDto) != 0;
    }

    private static TradingMappingVO getTradingMappingVO(DiaryDto diaryDto, DiaryDto buyOrder, int tradingNum) {
        int profit = Math.toIntExact((diaryDto.getTrading_price() - buyOrder.getTrading_price()) * diaryDto.getTrading_count());

        TradingMappingVO insertTradingVO = new TradingMappingVO();
        insertTradingVO.setBuy_trading_num(buyOrder.getTrading_num());
        insertTradingVO.setSell_trading_num(tradingNum);
        insertTradingVO.setSell_count(diaryDto.getTrading_count());
        insertTradingVO.setSell_price(diaryDto.getTrading_price());
        insertTradingVO.setProfit(profit);
        insertTradingVO.setCurrency(diaryDto.getCurrency());
        return insertTradingVO;
    }

    public boolean updateTradingDiary(DiaryDto diaryDto) {
        return diaryMapper.updateTradingDiary(diaryDto) > 0;
    }

    public boolean deleteTradingDiary(DiaryDto diaryDto) {
        return diaryMapper.deleteTradingDiary(diaryDto) > 0;
    }
}
