package com.nextlevelcoder.service;

import com.nextlevelcoder.dto.GoalRequest;
import com.nextlevelcoder.dto.GoalResponse;
import com.nextlevelcoder.model.*;
import com.nextlevelcoder.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GoalServiceImpl implements GoalService {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuizSubmissionRepository quizSubmissionRepository;

    @Autowired
    private NotificationService notificationService;

    @Override
    @Transactional(readOnly = true)
    public List<GoalResponse> getGoalsForUser(User user) {
        List<Goal> goals = goalRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return goals.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public GoalResponse createGoal(User user, GoalRequest request) {
        Goal goal = Goal.builder()
                .user(user)
                .title(request.getTitle())
                .type(request.getType())
                .targetValue("Custom".equalsIgnoreCase(request.getType()) ? 1 : request.getTargetValue())
                .currentValue(0)
                .isCompleted(false)
                .build();

        Goal savedGoal = goalRepository.save(goal);
        
        // Immediately run dynamic update so that progress metrics fetch current user stats
        if (!"Custom".equalsIgnoreCase(savedGoal.getType())) {
            updateDynamicGoal(user, savedGoal);
        }

        return mapToResponse(savedGoal);
    }

    @Override
    @Transactional
    public GoalResponse toggleGoal(User user, Long goalId) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new IllegalArgumentException("Goal not found for ID: " + goalId));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized access to Goal.");
        }

        if ("Custom".equalsIgnoreCase(goal.getType())) {
            boolean nextState = !goal.isCompleted();
            goal.setCompleted(nextState);
            goal.setCurrentValue(nextState ? 1 : 0);
            
            if (nextState) {
                notificationService.createNotification(
                        user,
                        "Goal Completed!",
                        "Congratulations! You completed your task: " + goal.getTitle(),
                        "Goal"
                );
            }
            goalRepository.save(goal);
        }

        return mapToResponse(goal);
    }

    @Override
    @Transactional
    public void deleteGoal(User user, Long goalId) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new IllegalArgumentException("Goal not found for ID: " + goalId));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized access to Goal.");
        }

        goalRepository.delete(goal);
    }

    @Override
    @Transactional
    public void updateDynamicGoals(User user) {
        List<Goal> activeGoals = goalRepository.findByUserIdAndIsCompletedFalse(user.getId());
        for (Goal goal : activeGoals) {
            if (!"Custom".equalsIgnoreCase(goal.getType())) {
                updateDynamicGoal(user, goal);
            }
        }
    }

    private void updateDynamicGoal(User user, Goal goal) {
        int val = 0;
        String type = goal.getType();

        if ("XP".equalsIgnoreCase(type)) {
            Optional<Profile> profileOpt = profileRepository.findByUser(user);
            if (profileOpt.isPresent()) {
                val = profileOpt.get().getXp() != null ? profileOpt.get().getXp() : 0;
            }
        } else if ("Problems".equalsIgnoreCase(type)) {
            Optional<Profile> profileOpt = profileRepository.findByUser(user);
            if (profileOpt.isPresent()) {
                val = profileOpt.get().getProblemsSolved() != null ? profileOpt.get().getProblemsSolved() : 0;
            }
        } else if ("Course".equalsIgnoreCase(type)) {
            val = getCompletedCoursesCount(user);
        }

        goal.setCurrentValue(val);
        if (goal.getCurrentValue() >= goal.getTargetValue()) {
            goal.setCompleted(true);
            notificationService.createNotification(
                    user,
                    "Goal Completed!",
                    "Congratulations! You completed your goal: " + goal.getTitle() + " (" + goal.getTargetValue() + " " + type + ")",
                    "Goal"
            );
        }
        goalRepository.save(goal);
    }

    private int getCompletedCoursesCount(User user) {
        List<Course> courses = courseRepository.findAll();
        int completedCount = 0;
        for (Course c : courses) {
            List<Topic> topics = topicRepository.findByCourseIdOrderBySequenceOrderAsc(c.getId());
            if (topics.isEmpty()) continue;
            boolean courseCompleted = true;
            for (Topic t : topics) {
                List<Question> questions = questionRepository.findByTopicId(t.getId());
                if (questions.isEmpty()) continue;
                for (Question q : questions) {
                    boolean solved = quizSubmissionRepository.existsByUserAndQuestionAndCorrect(user, q, true);
                    if (!solved) {
                        courseCompleted = false;
                        break;
                    }
                }
                if (!courseCompleted) break;
            }
            if (courseCompleted) {
                completedCount++;
            }
        }
        return completedCount;
    }

    private GoalResponse mapToResponse(Goal goal) {
        return GoalResponse.builder()
                .id(goal.getId())
                .title(goal.getTitle())
                .targetValue(goal.getTargetValue())
                .currentValue(goal.getCurrentValue())
                .type(goal.getType())
                .isCompleted(goal.isCompleted())
                .createdAt(goal.getCreatedAt())
                .build();
    }
}
