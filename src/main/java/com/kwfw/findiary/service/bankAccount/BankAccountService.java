package com.kwfw.findiary.service.bankAccount;

import com.kwfw.findiary.mapper.bankAccountMapper.BankAccountMapper;
import com.kwfw.findiary.model.BankAccountDto;
import com.kwfw.findiary.model.UserInfoVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BankAccountService {

    private final BankAccountMapper bankAccountMapper;

    public List<BankAccountDto> getSearchBankAccountNumList(UserInfoVO userInfoVO) {
        return bankAccountMapper.getSearchBankAccountNumList(userInfoVO);
    }

    public BankAccountDto getUserBankAccountNum(BankAccountDto bankAccountDto) {
        return bankAccountMapper.getUserBankAccountNum(bankAccountDto);
    }
}
