package com.nextlevelcoder.service;

import com.nextlevelcoder.dto.AchievementDto;
import com.nextlevelcoder.model.User;

import java.util.List;

public interface AchievementService {
    void checkAndAwardAchievements(User user);
    List<AchievementDto> getAchievementsForUser(User user);
}
