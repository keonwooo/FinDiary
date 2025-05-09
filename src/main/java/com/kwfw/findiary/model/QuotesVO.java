package com.kwfw.findiary.model;

import lombok.Data;

@Data
public class QuotesVO {
    private int quotes_num;
    private int status;
    
    private String language_en;
    private String author_en;
    private String language_ko;
    private String author_ko;
    private String descr;
}
