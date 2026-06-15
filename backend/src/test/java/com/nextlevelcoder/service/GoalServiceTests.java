package com.nextlevelcoder.service;

import com.nextlevelcoder.dto.GoalRequest;
import com.nextlevelcoder.dto.GoalResponse;
import com.nextlevelcoder.model.*;
import com.nextlevelcoder.repository.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class GoalServiceTests {

    @Autowired
    private GoalService goalService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuizSubmissionRepository quizSubmissionRepository;

    private User testUser;
    private Profile testProfile;

    @BeforeEach
    void setUp() {
        quizSubmissionRepository.deleteAll();
        questionRepository.deleteAll();
        topicRepository.deleteAll();
        courseRepository.deleteAll();
        notificationRepository.deleteAll();
        goalRepository.deleteAll();
        profileRepository.deleteAll();
        userRepository.deleteAll();

        testUser = User.builder()
                .username("testgoalsuser")
                .email("testgoalsuser@example.com")
                .password("Password123!")
                .build();
        testUser = userRepository.save(testUser);

        testProfile = Profile.builder()
                .user(testUser)
                .xp(100)
                .level("Beginner")
                .problemsSolved(2)
                .accuracy(100.0)
                .build();
        testProfile = profileRepository.save(testProfile);
    }

    @AfterEach
    void tearDown() {
        quizSubmissionRepository.deleteAll();
        questionRepository.deleteAll();
        topicRepository.deleteAll();
        courseRepository.deleteAll();
        notificationRepository.deleteAll();
        goalRepository.deleteAll();
        profileRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void testCreateAndToggleCustomGoal() {
        // Create custom checklist goal
        GoalRequest req = new GoalRequest();
        req.setTitle("Do standard practice task");
        req.setType("Custom");
        req.setTargetValue(1);

        GoalResponse res = goalService.createGoal(testUser, req);
        assertNotNull(res.getId());
        assertEquals("Do standard practice task", res.getTitle());
        assertEquals("Custom", res.getType());
        assertFalse(res.isCompleted());
        assertEquals(0, res.getCurrentValue());

        // Toggle completion
        GoalResponse toggled = goalService.toggleGoal(testUser, res.getId());
        assertTrue(toggled.isCompleted());
        assertEquals(1, toggled.getCurrentValue());

        // Toggle back
        GoalResponse untoggled = goalService.toggleGoal(testUser, res.getId());
        assertFalse(untoggled.isCompleted());
        assertEquals(0, untoggled.getCurrentValue());
    }

    @Test
    void testCreateAndAutoUpdateXpGoal() {
        // User has 100 XP initially
        GoalRequest req = new GoalRequest();
        req.setTitle("Reach 250 XP");
        req.setType("XP");
        req.setTargetValue(250);

        GoalResponse res = goalService.createGoal(testUser, req);
        assertNotNull(res.getId());
        assertEquals("Reach 250 XP", res.getTitle());
        assertEquals("XP", res.getType());
        assertFalse(res.isCompleted());
        assertEquals(100, res.getCurrentValue()); // Dynamically populated on creation!

        // Increase XP to 300
        testProfile.setXp(300);
        profileRepository.save(testProfile);

        // Run dynamic check
        goalService.updateDynamicGoals(testUser);

        // Fetch goals
        List<GoalResponse> goals = goalService.getGoalsForUser(testUser);
        assertEquals(1, goals.size());
        GoalResponse updated = goals.get(0);
        assertTrue(updated.isCompleted());
        assertEquals(300, updated.getCurrentValue());
    }

    @Test
    void testProblemsSolvedGoal() {
        // User has 2 problems solved initially
        GoalRequest req = new GoalRequest();
        req.setTitle("Solve 5 Coding Exercises");
        req.setType("Problems");
        req.setTargetValue(5);

        GoalResponse res = goalService.createGoal(testUser, req);
        assertEquals(2, res.getCurrentValue());
        assertFalse(res.isCompleted());

        // Solve remaining
        testProfile.setProblemsSolved(6);
        profileRepository.save(testProfile);

        // Run dynamic check
        goalService.updateDynamicGoals(testUser);

        // Fetch
        List<GoalResponse> goals = goalService.getGoalsForUser(testUser);
        GoalResponse updated = goals.get(0);
        assertTrue(updated.isCompleted());
        assertEquals(6, updated.getCurrentValue());
    }

    @Test
    void testCreateAndAutoUpdateCourseGoal() {
        // Create a Course, Topic, and Question
        Course course = Course.builder()
                .title("Intro to React")
                .description("React Basics")
                .difficulty("Basic")
                .build();
        course = courseRepository.save(course);

        Topic topic = Topic.builder()
                .course(course)
                .title("Components")
                .concept("React Components concept")
                .sequenceOrder(1)
                .build();
        topic = topicRepository.save(topic);

        Question question = Question.builder()
                .topic(topic)
                .type("MCQ")
                .title("What is a component?")
                .description("Explain components")
                .difficulty("Easy")
                .correctAnswer("A function returning JSX")
                .xpReward(10)
                .build();
        question = questionRepository.save(question);

        // Create Course completion goal
        GoalRequest req = new GoalRequest();
        req.setTitle("Finish 1 Course");
        req.setType("Course");
        req.setTargetValue(1);

        GoalResponse res = goalService.createGoal(testUser, req);
        assertEquals(0, res.getCurrentValue());
        assertFalse(res.isCompleted());

        // Solve the quiz question correctly
        QuizSubmission sub = QuizSubmission.builder()
                .user(testUser)
                .question(question)
                .correct(true)
                .build();
        quizSubmissionRepository.save(sub);

        // Run dynamic check
        goalService.updateDynamicGoals(testUser);

        // Fetch
        List<GoalResponse> goals = goalService.getGoalsForUser(testUser);
        GoalResponse updated = goals.stream()
                .filter(g -> "Course".equalsIgnoreCase(g.getType()))
                .findFirst()
                .orElseThrow();
        assertTrue(updated.isCompleted());
        assertEquals(1, updated.getCurrentValue());
    }
}
