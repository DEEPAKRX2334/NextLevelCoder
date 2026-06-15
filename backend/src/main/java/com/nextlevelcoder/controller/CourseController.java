package com.nextlevelcoder.controller;

import com.nextlevelcoder.model.Course;
import com.nextlevelcoder.model.Topic;
import com.nextlevelcoder.model.Question;
import com.nextlevelcoder.model.User;
import com.nextlevelcoder.model.Profile;
import com.nextlevelcoder.model.QuizSubmission;
import com.nextlevelcoder.repository.CourseRepository;
import com.nextlevelcoder.repository.TopicRepository;
import com.nextlevelcoder.repository.QuestionRepository;
import com.nextlevelcoder.repository.UserRepository;
import com.nextlevelcoder.repository.ProfileRepository;
import com.nextlevelcoder.repository.QuizSubmissionRepository;
import com.nextlevelcoder.dto.QuestionSubmitRequest;
import com.nextlevelcoder.dto.QuestionSubmitResponse;
import com.nextlevelcoder.security.UserDetailsImpl;
import com.nextlevelcoder.service.AchievementService;
import com.nextlevelcoder.service.GoalService;
import lombok.Builder;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private QuizSubmissionRepository quizSubmissionRepository;

    @Autowired
    private AchievementService achievementService;

    @Autowired
    private GoalService goalService;

    @GetMapping
    public ResponseEntity<List<CourseResponseDto>> getAllCourses(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<Course> allCourses = courseRepository.findAll();
        User user = null;
        if (userDetails != null) {
            user = userRepository.findById(userDetails.getId()).orElse(null);
        }

        List<CourseResponseDto> dtoList = new ArrayList<>();
        for (Course c : allCourses) {
            List<Topic> topics = topicRepository.findByCourseIdOrderBySequenceOrderAsc(c.getId());
            int totalTopics = topics.size();
            int completedTopics = 0;
            List<TopicSummary> topicSummaries = new ArrayList<>();

            for (Topic t : topics) {
                List<Question> questions = questionRepository.findByTopicId(t.getId());
                boolean allSolved = true;
                if (questions.isEmpty()) {
                    completedTopics++;
                } else {
                    if (user != null) {
                        for (Question q : questions) {
                            boolean solved = quizSubmissionRepository.existsByUserAndQuestionAndCorrect(user, q, true);
                            if (!solved) {
                                allSolved = false;
                                break;
                            }
                        }
                    } else {
                        allSolved = false;
                    }
                    if (allSolved) {
                        completedTopics++;
                    }
                }

                topicSummaries.add(TopicSummary.builder()
                        .id(t.getId())
                        .title(t.getTitle())
                        .sequenceOrder(t.getSequenceOrder())
                        .completed(user != null ? allSolved : false)
                        .build());
            }

            int progress = totalTopics > 0 ? (completedTopics * 100) / totalTopics : 0;
            dtoList.add(CourseResponseDto.builder()
                    .id(c.getId())
                    .title(c.getTitle())
                    .description(c.getDescription())
                    .difficulty(c.getDifficulty())
                    .lessonsCount(totalTopics)
                    .progress(progress)
                    .topics(topicSummaries)
                    .build());
        }

        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDetailsResponse> getCourseById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<Course> courseOpt = courseRepository.findById(id);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Course course = courseOpt.get();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        List<Topic> topics = topicRepository.findByCourseIdOrderBySequenceOrderAsc(id);

        int totalTopics = topics.size();
        int completedTopics = 0;

        List<TopicSummary> topicSummaries = new ArrayList<>();
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
            
            topicSummaries.add(TopicSummary.builder()
                    .id(t.getId())
                    .title(t.getTitle())
                    .sequenceOrder(t.getSequenceOrder())
                    .completed(allSolved)
                    .build());
        }

        int progress = totalTopics > 0 ? (completedTopics * 100) / totalTopics : 0;

        return ResponseEntity.ok(CourseDetailsResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .difficulty(course.getDifficulty())
                .progress(progress)
                .topics(topicSummaries)
                .build());
    }

    @GetMapping("/topics/{topicId}")
    public ResponseEntity<TopicDetailResponse> getTopicById(@PathVariable Long topicId) {
        Optional<Topic> topicOpt = topicRepository.findById(topicId);
        if (topicOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Topic topic = topicOpt.get();
        return ResponseEntity.ok(TopicDetailResponse.builder()
                .id(topic.getId())
                .courseId(topic.getCourse().getId())
                .title(topic.getTitle())
                .concept(topic.getConcept())
                .examples(topic.getExamples())
                .notes(topic.getNotes())
                .hints(topic.getHints())
                .solutions(topic.getSolutions())
                .sequenceOrder(topic.getSequenceOrder())
                .build());
    }

    @GetMapping("/topics/{topicId}/questions")
    public ResponseEntity<List<QuestionDto>> getQuestionsForTopic(
            @PathVariable Long topicId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        List<Question> questions = questionRepository.findByTopicId(topicId);
        
        List<QuestionDto> response = questions.stream()
                .map(q -> {
                    boolean solved = quizSubmissionRepository.existsByUserAndQuestionAndCorrect(user, q, true);
                    return QuestionDto.builder()
                            .id(q.getId())
                            .type(q.getType())
                            .title(q.getTitle())
                            .description(q.getDescription())
                            .difficulty(q.getDifficulty())
                            .options(q.getOptions())
                            .xpReward(q.getXpReward())
                            .correct(solved)
                            .build();
                })
                .toList();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/topics/questions/{questionId}/submit")
    public ResponseEntity<QuestionSubmitResponse> submitAnswer(
            @PathVariable Long questionId,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody QuestionSubmitRequest request) {

        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<Question> questionOpt = questionRepository.findById(questionId);
        if (questionOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Question question = questionOpt.get();

        boolean correct = false;
        String answer = request.getAnswer();
        if (answer != null && question.getCorrectAnswer() != null) {
            correct = answer.trim().equalsIgnoreCase(question.getCorrectAnswer().trim());
        }

        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        Profile profile = profileRepository.findByUser(user).orElseThrow();

        // Prevent dynamic double-solve XP rewards
        boolean alreadySolved = quizSubmissionRepository.existsByUserAndQuestionAndCorrect(user, question, true);

        int xpEarned = 0;
        if (correct) {
            if (!alreadySolved) {
                xpEarned = question.getXpReward() != null ? question.getXpReward() : 10;
                profile.setXp(profile.getXp() + xpEarned);

                if (profile.getXp() >= 10000) {
                    profile.setLevel("Master");
                } else if (profile.getXp() >= 5000) {
                    profile.setLevel("Expert");
                } else if (profile.getXp() >= 2000) {
                    profile.setLevel("Advanced");
                } else if (profile.getXp() >= 500) {
                    profile.setLevel("Intermediate");
                } else {
                    profile.setLevel("Beginner");
                }
                profileRepository.save(profile);
            }

            if (!alreadySolved) {
                QuizSubmission submission = QuizSubmission.builder()
                        .user(user)
                        .question(question)
                        .correct(true)
                        .build();
                quizSubmissionRepository.save(submission);
            }
        } else {
            QuizSubmission submission = QuizSubmission.builder()
                    .user(user)
                    .question(question)
                    .correct(false)
                    .build();
            quizSubmissionRepository.save(submission);
        }

        if (correct && !alreadySolved) {
            try {
                achievementService.checkAndAwardAchievements(user);
                goalService.updateDynamicGoals(user);
            } catch (Exception e) {
                System.err.println("Failed to dynamically check achievements/goals in CourseController: " + e.getMessage());
            }
        }

        return ResponseEntity.ok(QuestionSubmitResponse.builder()
                .correct(correct)
                .correctAnswer(correct ? null : question.getCorrectAnswer())
                .xpEarned(xpEarned)
                .build());
    }

    @Data
    @Builder
    public static class CourseDetailsResponse {
        private Long id;
        private String title;
        private String description;
        private String difficulty;
        private int progress;
        private List<TopicSummary> topics;
    }

    @Data
    @Builder
    public static class CourseResponseDto {
        private Long id;
        private String title;
        private String description;
        private String difficulty;
        private int lessonsCount;
        private int progress;
        private List<TopicSummary> topics;
    }

    @Data
    @Builder
    public static class QuestionDto {
        private Long id;
        private String type;
        private String title;
        private String description;
        private String difficulty;
        private String options;
        private Integer xpReward;
        private boolean correct;
    }

    @Data
    @Builder
    public static class TopicSummary {
        private Long id;
        private String title;
        private Integer sequenceOrder;
        private Boolean completed;
    }

    @Data
    @Builder
    public static class TopicDetailResponse {
        private Long id;
        private Long courseId;
        private String title;
        private String concept;
        private String examples;
        private String notes;
        private String hints;
        private String solutions;
        private Integer sequenceOrder;
    }
}
