package com.kwfw.findiary.mapper.diary;

import com.kwfw.findiary.model.DiaryDto;
import com.kwfw.findiary.model.DiaryVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DiaryMapper {
    List<DiaryDto> getUserDiary(DiaryVO diaryVO);
}
