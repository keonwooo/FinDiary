package com.kwfw.findiary.service.dashboard;

import com.kwfw.findiary.mapper.dashboard.DashboardMapper;
import com.kwfw.findiary.model.QuotesVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DashboardMapper dashboardMapper;

    public List<QuotesVO> getQuotes() {
        return dashboardMapper.getQuotes();
    }
}
