package com.kwfw.findiary.mapper.bankAccount;

import com.kwfw.findiary.model.BankAccountDto;
import com.kwfw.findiary.model.DiaryDto;
import com.kwfw.findiary.model.HoldingStockDto;
import com.kwfw.findiary.model.UserInfoVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BankAccountMapper {
    List<BankAccountDto> getSearchBankAccountNumList(UserInfoVO userInfoVO);

    BankAccountDto getUserBankAccountNum(BankAccountDto bankAccountDto);

    BankAccountDto getBankAccountProperty(DiaryDto diaryDto);

    int updateBankAccountPropertyAtInsert(BankAccountDto bankAccountDto);

    int updateBankAccountPropertyAtDelete(BankAccountDto bankAccountDto);

    HoldingStockDto getHoldingStock(DiaryDto diaryDto);

    void insertHoldingStock(HoldingStockDto holdingStockDto);

    void updateHoldingStock(HoldingStockDto holdingStockDto);

    int updateHoldingStockAtDelete(HoldingStockDto holdingStockDto);
}
