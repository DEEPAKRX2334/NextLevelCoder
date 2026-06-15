package com.nextlevelcoder.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GoalRequest {
    @NotBlank
    private String title;

    private int targetValue;

    @NotBlank
    private String type; // 'XP', 'Problems', 'Course', 'Custom'
}
