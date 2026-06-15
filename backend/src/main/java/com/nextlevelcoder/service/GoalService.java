package com.nextlevelcoder.service;

import com.nextlevelcoder.dto.GoalRequest;
import com.nextlevelcoder.dto.GoalResponse;
import com.nextlevelcoder.model.User;

import java.util.List;

public interface GoalService {
    List<GoalResponse> getGoalsForUser(User user);
    GoalResponse createGoal(User user, GoalRequest request);
    GoalResponse toggleGoal(User user, Long goalId);
    void deleteGoal(User user, Long goalId);
    void updateDynamicGoals(User user);
}
