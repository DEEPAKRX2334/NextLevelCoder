package com.nextlevelcoder.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProblemStatusResponse {
    private Long id;
    private String title;
    private String description;
    private String difficulty;
    private String constraints;
    private String javaTemplate;
    private String javascriptTemplate;
    private String sqlTemplate;
    private boolean unlocked;
    private boolean solved;
    private String category;
    private String schemaSql;
    private boolean bookmarked;
}
