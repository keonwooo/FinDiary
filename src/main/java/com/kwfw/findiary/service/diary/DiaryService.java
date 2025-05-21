package com.kwfw.findiary.service.diary;

import com.kwfw.findiary.common.ConstantCommon;
import com.kwfw.findiary.mapper.bankAccount.BankAccountMapper;
import com.kwfw.findiary.mapper.diary.DiaryMapper;
import com.kwfw.findiary.model.BankAccountDto;
import com.kwfw.findiary.model.DiaryDto;
import com.kwfw.findiary.model.DiaryVO;
import com.kwfw.findiary.model.TradingMappingVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class DiaryService {

    private final DiaryMapper diaryMapper;

    private final BankAccountMapper bankAccountMapper;

    public List<DiaryDto> getUserDiary(DiaryVO diaryVO) {
        return diaryMapper.getUserDiary(diaryVO);
    }

    public boolean insertTradingDiary(DiaryDto diaryDto) {
        String tradingType = diaryDto.getTrading_type();

        BankAccountDto bankAccountDto = bankAccountMapper.getBankAccountProperty(diaryDto);
        if (bankAccountDto == null) {
            // 보유 자산 없음
            return false;
        }

        float current_property = bankAccountDto.getAccount_total_property();
        float trading_price = diaryDto.getTrading_price() * diaryDto.getTrading_count();

        float total_property;
        if (tradingType.equals(ConstantCommon.TRADING_TYPE_BUY)) {
            // 매수
            total_property = current_property - trading_price;
            if (total_property < 0) {
                return false;
            }
        } else {
            // 매도
            total_property = current_property + trading_price;
        }

        bankAccountDto.setAccount_total_property(total_property);
        bankAccountMapper.updateBankAccountProperty(bankAccountDto);

        // 매매 일지 insert
        boolean result = diaryMapper.insertTradingDiary(diaryDto) > 0;
        int tradingNum = diaryDto.getTrading_num();

        // TODO 보유 주식 테이블(TB_HELDING_STOCK) Update or Insert 필요
        if (result && tradingType.equals(ConstantCommon.TRADING_TYPE_SELL)) {
            // 매도
            List<DiaryDto> buyOrders = diaryMapper.selectRemainingBuyOrders(diaryDto);

            if (buyOrders.isEmpty()) {
                // TODO 매도 물량 없는 경우 팝업 필요
                throw new RuntimeException("매도 수량 부족");
            }

            // TODO 수익률 반환
            float profit = 0;
            int remainingSellCount = diaryDto.getTrading_count();
            for (DiaryDto buyOrder : buyOrders) {
                int buyRemaining = buyOrder.getTrading_count()
                        - diaryMapper.getAlreadyMappedCount(buyOrder.getTrading_num());

                int useCount = Math.min(remainingSellCount, buyRemaining);
                if (useCount > 0) {
                    TradingMappingVO insertTradingVO = getTradingMappingVO(diaryDto, buyOrder, tradingNum, buyRemaining);
                    profit += insertTradingVO.getProfit();

                    diaryMapper.insertTradingMapping(insertTradingVO);

                    remainingSellCount -= useCount;
                }

                if (remainingSellCount == 0) break;
            }
        }

        return result;
    }

    private static TradingMappingVO getTradingMappingVO(DiaryDto diaryDto, DiaryDto buyOrder, int tradingNum, int buyRemaining) {
        float profit = (diaryDto.getTrading_price() - buyOrder.getTrading_price()) * buyRemaining;

        TradingMappingVO insertTradingVO = new TradingMappingVO();
        insertTradingVO.setBuy_trading_num(buyOrder.getTrading_num());
        insertTradingVO.setSell_trading_num(tradingNum);
        insertTradingVO.setSell_count(Integer.min(buyRemaining, diaryDto.getTrading_count()));
        insertTradingVO.setSell_price(diaryDto.getTrading_price());
        insertTradingVO.setProfit(profit);
        insertTradingVO.setCurrency(diaryDto.getCurrency());
        return insertTradingVO;
    }

    public boolean updateTradingDiary(DiaryDto diaryDto) {
        return diaryMapper.updateTradingDiary(diaryDto) > 0;
    }

    public boolean checkTradingMapping(DiaryDto diaryDto) {
        return diaryMapper.checkTradingMapping(diaryDto) > 0;
    }

    public boolean deleteTradingDiary(DiaryDto diaryDto) {
        // mapping된 매매 기록 삭제
        deleteTradingMapping(diaryDto);

        return diaryMapper.deleteTradingDiary(diaryDto) > 0;
    }

    private void deleteTradingMapping(DiaryDto diaryDto) {
        diaryMapper.deleteTradingMapping(diaryDto);
    }
}
