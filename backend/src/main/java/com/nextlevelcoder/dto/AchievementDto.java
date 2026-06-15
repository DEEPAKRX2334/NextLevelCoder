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
public class AchievementDto {
    private String title;
    private String desc;
    private String badgeUrl;
    private boolean unlocked;
    private String progress;
    private LocalDateTime earnedAt;
}
