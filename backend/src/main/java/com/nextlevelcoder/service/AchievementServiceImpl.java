package com.nextlevelcoder.service;

import com.nextlevelcoder.dto.AchievementDto;
import com.nextlevelcoder.model.Achievement;
import com.nextlevelcoder.model.Profile;
import com.nextlevelcoder.model.Submission;
import com.nextlevelcoder.model.QuizSubmission;
import com.nextlevelcoder.model.User;
import com.nextlevelcoder.model.UserAchievement;
import com.nextlevelcoder.repository.AchievementRepository;
import com.nextlevelcoder.repository.ProfileRepository;
import com.nextlevelcoder.repository.SubmissionRepository;
import com.nextlevelcoder.repository.QuizSubmissionRepository;
import com.nextlevelcoder.repository.UserAchievementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AchievementServiceImpl implements AchievementService {

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private UserAchievementRepository userAchievementRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private QuizSubmissionRepository quizSubmissionRepository;

    @Override
    @Transactional
    public void checkAndAwardAchievements(User user) {
        Profile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found for user ID: " + user.getId()));

        List<Achievement> allAchievements = achievementRepository.findAll();
        List<UserAchievement> earned = userAchievementRepository.findByUser(user);
        Set<Long> earnedIds = earned.stream()
                .map(ua -> ua.getAchievement().getId())
                .collect(Collectors.toSet());

        // Gather streak data in case it's needed
        int longestStreak = -1; 

        for (Achievement achievement : allAchievements) {
            if (earnedIds.contains(achievement.getId())) {
                continue; // Already earned
            }

            boolean qualified = false;
            String type = achievement.getCriteriaType();
            int val = achievement.getCriteriaValue();

            if ("PROBLEMS_SOLVED".equalsIgnoreCase(type)) {
                if (profile.getProblemsSolved() >= val) {
                    qualified = true;
                }
            } else if ("XP_EARNED".equalsIgnoreCase(type)) {
                if (profile.getXp() >= val) {
                    qualified = true;
                }
            } else if ("STREAK_DAYS".equalsIgnoreCase(type)) {
                if (longestStreak == -1) {
                    longestStreak = getLongestStreakForUser(user);
                }
                if (longestStreak >= val) {
                    qualified = true;
                }
            }

            if (qualified) {
                UserAchievement userAchievement = UserAchievement.builder()
                        .user(user)
                        .achievement(achievement)
                        .build();
                userAchievementRepository.save(userAchievement);
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<AchievementDto> getAchievementsForUser(User user) {
        Profile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found for user ID: " + user.getId()));

        List<Achievement> allAchievements = achievementRepository.findAll();
        List<UserAchievement> earned = userAchievementRepository.findByUser(user);
        Map<Long, UserAchievement> earnedMap = earned.stream()
                .collect(Collectors.toMap(ua -> ua.getAchievement().getId(), ua -> ua));

        int longestStreak = -1;

        List<AchievementDto> dtos = new ArrayList<>();
        for (Achievement achievement : allAchievements) {
            UserAchievement ua = earnedMap.get(achievement.getId());
            boolean unlocked = ua != null;

            String type = achievement.getCriteriaType();
            int limit = achievement.getCriteriaValue();
            String progressStr = "0/" + limit;

            if ("PROBLEMS_SOLVED".equalsIgnoreCase(type)) {
                int current = profile.getProblemsSolved() != null ? profile.getProblemsSolved() : 0;
                progressStr = Math.min(current, limit) + "/" + limit;
            } else if ("XP_EARNED".equalsIgnoreCase(type)) {
                int current = profile.getXp() != null ? profile.getXp() : 0;
                progressStr = Math.min(current, limit) + "/" + limit;
            } else if ("STREAK_DAYS".equalsIgnoreCase(type)) {
                if (longestStreak == -1) {
                    longestStreak = getLongestStreakForUser(user);
                }
                progressStr = Math.min(longestStreak, limit) + "/" + limit;
            }

            dtos.add(AchievementDto.builder()
                    .title(achievement.getName())
                    .desc(achievement.getDescription())
                    .badgeUrl(achievement.getBadgeUrl())
                    .unlocked(unlocked)
                    .progress(progressStr)
                    .earnedAt(unlocked ? ua.getEarnedAt() : null)
                    .build());
        }

        return dtos;
    }

    private int getLongestStreakForUser(User user) {
        List<Submission> submissions = submissionRepository.findByUser(user);
        List<QuizSubmission> quizSubmissions = quizSubmissionRepository.findByUser(user);

        Set<LocalDate> activeDates = new HashSet<>();
        for (Submission s : submissions) {
            activeDates.add(s.getCreatedAt().toLocalDate());
        }
        for (QuizSubmission qs : quizSubmissions) {
            activeDates.add(qs.getCreatedAt().toLocalDate());
        }

        if (activeDates.isEmpty()) return 0;

        List<LocalDate> sortedDates = new ArrayList<>(activeDates);
        Collections.sort(sortedDates);

        int maxStreak = 0;
        int currentStreak = 0;
        LocalDate previousDate = null;

        for (LocalDate date : sortedDates) {
            if (previousDate == null) {
                currentStreak = 1;
            } else if (date.equals(previousDate.plusDays(1))) {
                currentStreak++;
            } else if (!date.equals(previousDate)) {
                maxStreak = Math.max(maxStreak, currentStreak);
                currentStreak = 1;
            }
            previousDate = date;
        }

        return Math.max(maxStreak, currentStreak);
    }
}
