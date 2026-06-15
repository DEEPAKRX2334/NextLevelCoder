package com.nextlevelcoder.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkDto {
    private Long id;
    private String type; // "CODING" or "QUIZ"
    private Long targetId;
    private String title;
    private String description;
    private LocalDateTime createdAt;
}
