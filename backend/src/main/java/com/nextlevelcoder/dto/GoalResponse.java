package com.nextlevelcoder.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoalResponse {
    private Long id;
    private String title;
    private int targetValue;
    private int currentValue;
    private String type;
    private boolean isCompleted;
    private LocalDateTime createdAt;
}
