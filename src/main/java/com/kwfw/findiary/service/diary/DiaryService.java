package com.kwfw.findiary.service.diary;

import com.kwfw.findiary.common.ConstantCommon;
import com.kwfw.findiary.common.UtilKw;
import com.kwfw.findiary.mapper.bankAccount.BankAccountMapper;
import com.kwfw.findiary.mapper.diary.DiaryMapper;
import com.kwfw.findiary.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class DiaryService {

    private final DiaryMapper diaryMapper;

    private final BankAccountMapper bankAccountMapper;

    public List<DiaryDto> getUserDiary(DiaryVO diaryVO) {
        return diaryMapper.getUserDiary(diaryVO);
    }

    public Map<String, String> insertTradingDiary(DiaryDto diaryDto) {
        Map<String, String> response = new HashMap<>();

        String tradingType = diaryDto.getTrading_type();

        BankAccountDto bankAccountDto = bankAccountMapper.getBankAccountProperty(diaryDto);
        if (bankAccountDto == null) {
            // 보유 자산 없음
            UtilKw.rollback();

            response.put("responseCode", ConstantCommon.NO_MONEY);
            response.put("responseMsg", ConstantCommon.NO_MONEY_STR);

            return response;
        }

        // 계좌별 현금 자산 update
        if (!updateAccountProperty(bankAccountDto, diaryDto.getTrading_price(), diaryDto.getTrading_count(), tradingType)) {
            // 보유 자산 부족
            UtilKw.rollback();

            response.put("responseCode", ConstantCommon.NOT_ENOUGH_MONEY);
            response.put("responseMsg", ConstantCommon.NOT_ENOUGH_MONEY_STR);

            return response;
        }

        // 매매 일지 insert
        boolean result = diaryMapper.insertTradingDiary(diaryDto) > 0;
        int tradingNum = diaryDto.getTrading_num();

        HoldingStockDto holdingStock = bankAccountMapper.getHoldingStock(diaryDto);
        if (holdingStock == null) {
            // 보유 주식 테이블 insert
            HoldingStockDto holdingStockDto = getHoldingStockDto(diaryDto);
            bankAccountMapper.insertHoldingStock(holdingStockDto);
        } else {
            // 보유 주식 테이블 update
            float currentTradingPrice = holdingStock.getHolding_total_price();
            float addTradingPrice = diaryDto.getTrading_price() * diaryDto.getTrading_count();

            float totalTradingPrice;
            int totalTradingCount;

            HoldingStockDto updateHoldingStock = holdingStock.clone();

            if (tradingType.equals(ConstantCommon.TRADING_TYPE_BUY)) {
                // 매수
                totalTradingCount = holdingStock.getHolding_count() + diaryDto.getTrading_count();

                totalTradingPrice = currentTradingPrice + addTradingPrice;
                float averageTradingPrice = totalTradingPrice / totalTradingCount;

                updateHoldingStock.setHolding_average_price(averageTradingPrice);
                updateHoldingStock.setStatus(1);
            } else {
                // 매도
                totalTradingCount = holdingStock.getHolding_count() - diaryDto.getTrading_count();
                totalTradingPrice = currentTradingPrice - addTradingPrice;

                if (totalTradingCount < 0) {
                    // 매도 수량 부족
                    UtilKw.rollback();

                    response.put("responseCode", ConstantCommon.NOT_ENOUGH_HOLDING_STOCK);
                    response.put("responseMsg", ConstantCommon.NOT_ENOUGH_HOLDING_STOCK_STR);

                    return response;
                } else if (totalTradingCount == 0) {
                    // 전부 매도인 경우
                    totalTradingPrice = 0;
                    updateHoldingStock.setHolding_average_price(0);
                    updateHoldingStock.setStatus(0);
                }
            }

            updateHoldingStock.setHolding_count(totalTradingCount);
            updateHoldingStock.setHolding_total_price(totalTradingPrice);

            bankAccountMapper.updateHoldingStock(updateHoldingStock);
        }

        if (result && tradingType.equals(ConstantCommon.TRADING_TYPE_SELL)) {
            // 매도
            List<DiaryDto> buyOrders = diaryMapper.selectRemainingBuyOrders(diaryDto);

            if (buyOrders.isEmpty()) {
                UtilKw.rollback();

                response.put("responseCode", ConstantCommon.NOT_ENOUGH_HOLDING_STOCK);
                response.put("responseMsg", ConstantCommon.NOT_ENOUGH_HOLDING_STOCK_STR);

                return response;
            }

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
            response.put("profit", String.valueOf(profit));
            response.put("currency", UtilKw.convertCurrency(diaryDto.getCurrency()));
        }

        response.put("responseCode", ConstantCommon.RESPONSE_CODE_SUCCESS);
        response.put("responseMsg", ConstantCommon.RESPONSE_CODE_SUCCESS_STR);

        return response;
    }

    private static HoldingStockDto getHoldingStockDto(DiaryDto diaryDto) {
        float total_price = diaryDto.getTrading_price() * diaryDto.getTrading_count();
        float average_price = total_price / diaryDto.getTrading_count();

        HoldingStockDto holdingStockDto = new HoldingStockDto();
        holdingStockDto.setTicker(diaryDto.getTicker());
        holdingStockDto.setHolding_count(diaryDto.getTrading_count());
        holdingStockDto.setHolding_average_price(average_price);
        holdingStockDto.setHolding_total_price(total_price);
        holdingStockDto.setCurrency(diaryDto.getCurrency());
        holdingStockDto.setAccount_num(diaryDto.getAccount_num());
        return holdingStockDto;
    }

    private static TradingMappingVO getTradingMappingVO(DiaryDto diaryDto, DiaryDto buyOrder, int tradingNum, int buyRemaining) {
        float profit = (diaryDto.getTrading_price() - buyOrder.getTrading_price()) * diaryDto.getTrading_count();

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

        // TODO 매수, 매도 관련 기록 모두 삭제 (TB_HOLDING_STOCK, TB_BANK_ACCOUNT_PROPERTY, ...)
        deleteTradingMapping(diaryDto);

        return diaryMapper.deleteTradingDiary(diaryDto) > 0;
    }

    private void deleteTradingMapping(DiaryDto diaryDto) {
        diaryMapper.deleteTradingMapping(diaryDto);
    }

    private boolean updateAccountProperty(BankAccountDto bankAccountDto, float trading_price, int trading_count, String trading_type) {
        float current_property = bankAccountDto.getAccount_total_property();
        float total_price = trading_price * trading_count;

        float total_property;
        if (trading_type.equals(ConstantCommon.TRADING_TYPE_BUY)) {
            // 매수
            total_property = current_property - total_price;
            if (total_property < 0) {
                return false;
            }
        } else {
            // 매도
            total_property = current_property + total_price;
        }

        // 계좌 자산 현황 insert
        bankAccountDto.setAccount_total_property(total_property);
        return bankAccountMapper.updateBankAccountProperty(bankAccountDto) > 0;
    }
}