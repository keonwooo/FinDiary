package com.kwfw.findiary.mapper.dashboard;

import com.kwfw.findiary.model.QuotesVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DashboardMapper {
    List<QuotesVO> getQuotes();
}
