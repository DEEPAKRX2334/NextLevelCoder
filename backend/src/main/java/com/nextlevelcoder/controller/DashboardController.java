package com.nextlevelcoder.controller;

import com.nextlevelcoder.model.*;
import com.nextlevelcoder.repository.*;
import com.nextlevelcoder.security.UserDetailsImpl;
import lombok.Builder;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private CodingProblemRepository codingProblemRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuizSubmissionRepository quizSubmissionRepository;

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboardData(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        Profile profile = profileRepository.findByUser(user).orElseThrow();
        List<Submission> submissions = submissionRepository.findByUser(user);
        List<QuizSubmission> quizSubmissions = quizSubmissionRepository.findByUser(user);

        // Compute combined active dates
        Set<LocalDate> activeDates = new HashSet<>();
        for (Submission s : submissions) {
            activeDates.add(s.getCreatedAt().toLocalDate());
        }
        for (QuizSubmission qs : quizSubmissions) {
            activeDates.add(qs.getCreatedAt().toLocalDate());
        }

        // 1. Calculate Streaks based on combined active dates
        int currentStreak = calculateCurrentStreak(activeDates);
        int longestStreak = calculateLongestStreak(activeDates);

        // 2. Calculate Weekly Activity (Mon to Sun) based on combined events
        List<Integer> weeklyActivity = calculateWeeklyActivity(submissions, quizSubmissions);

        // 3. Calculate Yearly Heatmap (365 days)
        Map<String, Integer> activityHeatmap = new HashMap<>();
        LocalDate oneYearAgo = LocalDate.now().minusDays(365);

        for (Submission s : submissions) {
            LocalDate date = s.getCreatedAt().toLocalDate();
            if (!date.isBefore(oneYearAgo)) {
                String key = date.toString();
                activityHeatmap.put(key, activityHeatmap.getOrDefault(key, 0) + 1);
            }
        }

        for (QuizSubmission qs : quizSubmissions) {
            LocalDate date = qs.getCreatedAt().toLocalDate();
            if (!date.isBefore(oneYearAgo)) {
                String key = date.toString();
                activityHeatmap.put(key, activityHeatmap.getOrDefault(key, 0) + 1);
            }
        }

        // 4. Get Recent Submissions (Latest 4)
        List<RecentSubmissionDto> recentSubmissions = submissions.stream()
                .sorted((s1, s2) -> s2.getCreatedAt().compareTo(s1.getCreatedAt()))
                .limit(4)
                .map(s -> RecentSubmissionDto.builder()
                        .id(s.getId())
                        .problemId(s.getCodingProblem().getId())
                        .title(s.getCodingProblem().getTitle())
                        .difficulty(s.getCodingProblem().getDifficulty())
                        .status(s.getStatus())
                        .language(s.getLanguage())
                        .time(getRelativeTime(s.getCreatedAt()))
                        .build())
                .collect(Collectors.toList());

        // 5. Get Recommended Problems (3 unsolved ones)
        Set<Long> solvedProblemIds = submissions.stream()
                .filter(s -> s.getStatus().equals("Accepted"))
                .map(s -> s.getCodingProblem().getId())
                .collect(Collectors.toSet());

        List<CodingProblem> allProblems = codingProblemRepository.findAll();
        List<RecommendedProblemDto> recommendedProblems = allProblems.stream()
                .filter(p -> !solvedProblemIds.contains(p.getId()))
                .limit(3)
                .map(p -> RecommendedProblemDto.builder()
                        .id(p.getId())
                        .title(p.getTitle())
                        .difficulty(p.getDifficulty())
                        .category(getCategoryFromTitle(p.getTitle()))
                        .xp(p.getDifficulty().equalsIgnoreCase("Hard") ? 150 :
                            p.getDifficulty().equalsIgnoreCase("Medium") ? 100 : 50)
                        .build())
                .collect(Collectors.toList());

        // Pad recommended problems if there are not enough unsolved ones
        if (recommendedProblems.size() < 3) {
            allProblems.stream()
                    .filter(p -> solvedProblemIds.contains(p.getId()))
                    .limit(3 - recommendedProblems.size())
                    .map(p -> RecommendedProblemDto.builder()
                            .id(p.getId())
                            .title(p.getTitle())
                            .difficulty(p.getDifficulty())
                            .category(getCategoryFromTitle(p.getTitle()))
                            .xp(p.getDifficulty().equalsIgnoreCase("Hard") ? 150 :
                                p.getDifficulty().equalsIgnoreCase("Medium") ? 100 : 50)
                            .build())
                    .forEach(recommendedProblems::add);
        }

        // 6. Calculate Courses Progress Dynamically Based on Quiz completions
        List<Course> allCourses = courseRepository.findAll();

        List<CourseProgressDto> courses = allCourses.stream()
                .map(c -> {
                    String color = "from-indigo-500 to-violet-600";
                    if (c.getTitle().equalsIgnoreCase("Java Fundamentals")) {
                        color = "from-emerald-500 to-teal-600";
                    } else if (c.getTitle().equalsIgnoreCase("HTML & CSS")) {
                        color = "from-blue-500 to-indigo-600";
                    } else if (c.getTitle().equalsIgnoreCase("JavaScript")) {
                        color = "from-purple-500 to-pink-600";
                    } else if (c.getTitle().equalsIgnoreCase("Data Structures & Algorithms")) {
                        color = "from-violet-500 to-fuchsia-600";
                    } else if (c.getTitle().equalsIgnoreCase("System Design")) {
                        color = "from-amber-500 to-orange-600";
                    }

                    List<Topic> topics = topicRepository.findByCourseIdOrderBySequenceOrderAsc(c.getId());
                    int totalTopics = topics.size();
                    int completedTopics = 0;

                    for (Topic t : topics) {
                        List<Question> questions = questionRepository.findByTopicId(t.getId());
                        boolean allSolved = true;
                        if (questions.isEmpty()) {
                            completedTopics++;
                        } else {
                            for (Question q : questions) {
                                boolean solved = quizSubmissionRepository.existsByUserAndQuestionAndCorrect(user, q, true);
                                if (!solved) {
                                    allSolved = false;
                                    break;
                                }
                            }
                            if (allSolved) {
                                completedTopics++;
                            }
                        }
                    }

                    int progress = totalTopics > 0 ? (completedTopics * 100) / totalTopics : 0;

                    return CourseProgressDto.builder()
                            .id(c.getId())
                            .title(c.getTitle())
                            .progress(progress)
                            .lessons(totalTopics > 0 ? totalTopics : 3)
                            .color(color)
                            .build();
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(DashboardResponse.builder()
                .currentStreak(currentStreak)
                .longestStreak(longestStreak)
                .weeklyActivity(weeklyActivity)
                .recentSubmissions(recentSubmissions)
                .recommendedProblems(recommendedProblems)
                .courses(courses)
                .activityHeatmap(activityHeatmap)
                .build());
    }

    private int calculateCurrentStreak(Set<LocalDate> activeDates) {
        if (activeDates.isEmpty()) return 0;

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        if (!activeDates.contains(today) && !activeDates.contains(yesterday)) {
            return 0;
        }

        int streak = 0;
        LocalDate current = activeDates.contains(today) ? today : yesterday;

        while (activeDates.contains(current)) {
            streak++;
            current = current.minusDays(1);
        }

        return streak;
    }

    private int calculateLongestStreak(Set<LocalDate> activeDates) {
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

    private List<Integer> calculateWeeklyActivity(List<Submission> submissions, List<QuizSubmission> quizSubmissions) {
        LocalDate today = LocalDate.now();
        LocalDate monday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        
        List<Integer> activity = new ArrayList<>(Collections.nCopies(7, 0));
        
        for (Submission s : submissions) {
            LocalDate subDate = s.getCreatedAt().toLocalDate();
            if (!subDate.isBefore(monday) && !subDate.isAfter(monday.plusDays(6))) {
                int dayIndex = subDate.getDayOfWeek().getValue() - 1; // 0 = Mon, 6 = Sun
                activity.set(dayIndex, activity.get(dayIndex) + 1);
            }
        }

        for (QuizSubmission qs : quizSubmissions) {
            LocalDate subDate = qs.getCreatedAt().toLocalDate();
            if (!subDate.isBefore(monday) && !subDate.isAfter(monday.plusDays(6))) {
                int dayIndex = subDate.getDayOfWeek().getValue() - 1; // 0 = Mon, 6 = Sun
                activity.set(dayIndex, activity.get(dayIndex) + 1);
            }
        }
        
        return activity;
    }

    private String getRelativeTime(LocalDateTime ldt) {
        Duration duration = Duration.between(ldt, LocalDateTime.now());
        long seconds = duration.getSeconds();
        if (seconds < 60) return "Just now";
        long minutes = duration.toMinutes();
        if (minutes < 60) return minutes + "m ago";
        long hours = duration.toHours();
        if (hours < 24) return hours + "h ago";
        long days = duration.toDays();
        return days + "d ago";
    }

    private String getCategoryFromTitle(String title) {
        String lower = title.toLowerCase();
        if (lower.contains("salary") || lower.contains("department") || lower.contains("email") || lower.contains("sql")) {
            return "SQL";
        }
        if (lower.contains("reverse") || lower.contains("palindrome") || lower.contains("digit") || lower.contains("number") || lower.contains("armstrong") || lower.contains("strong") || lower.contains("fibonacci")) {
            return "Digits";
        }
        if (lower.contains("string") || lower.contains("vowel") || lower.contains("consonant") || lower.contains("word") || lower.contains("sentence") || lower.contains("space") || lower.contains("character") || lower.contains("anagram") || lower.contains("sort")) {
            return "String";
        }
        if (lower.contains("array") || lower.contains("element") || lower.contains("sum") || lower.contains("average") || lower.contains("sort") || lower.contains("duplicate") || lower.contains("merge") || lower.contains("search") || lower.contains("even") || lower.contains("odd")) {
            return "Array";
        }
        if (lower.contains("pattern") || lower.contains("star") || lower.contains("triangle") || lower.contains("pyramid") || lower.contains("diamond") || lower.contains("floyd") || lower.contains("pascal") || lower.contains("alphabet") || lower.contains("hollow")) {
            return "Pattern";
        }
        return "Algorithms";
    }

    @Data
    @Builder
    public static class DashboardResponse {
        private int currentStreak;
        private int longestStreak;
        private List<Integer> weeklyActivity;
        private List<RecentSubmissionDto> recentSubmissions;
        private List<RecommendedProblemDto> recommendedProblems;
        private List<CourseProgressDto> courses;
        private Map<String, Integer> activityHeatmap;
    }

    @Data
    @Builder
    public static class RecentSubmissionDto {
        private Long id;
        private Long problemId;
        private String title;
        private String difficulty;
        private String status;
        private String language;
        private String time;
    }

    @Data
    @Builder
    public static class RecommendedProblemDto {
        private Long id;
        private String title;
        private String difficulty;
        private String category;
        private int xp;
    }

    @Data
    @Builder
    public static class CourseProgressDto {
        private Long id;
        private String title;
        private int progress;
        private int lessons;
        private String color;
    }
}
