package com.nextlevelcoder.service;

import com.nextlevelcoder.dto.NoteRequest;
import com.nextlevelcoder.dto.NoteResponse;
import com.nextlevelcoder.model.*;
import com.nextlevelcoder.repository.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class NoteServiceTests {

    @Autowired
    private NoteService noteService;

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuizSubmissionRepository quizSubmissionRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private ProfileRepository profileRepository;

    private User testUser;
    private Topic testTopic;

    @BeforeEach
    void setUp() {
        noteRepository.deleteAll();
        quizSubmissionRepository.deleteAll();
        questionRepository.deleteAll();
        topicRepository.deleteAll();
        courseRepository.deleteAll();
        notificationRepository.deleteAll();
        goalRepository.deleteAll();
        profileRepository.deleteAll();
        userRepository.deleteAll();

        testUser = User.builder()
                .username("testnotesuser")
                .email("testnotesuser@example.com")
                .password("Password123!")
                .build();
        testUser = userRepository.save(testUser);

        Course course = Course.builder()
                .title("Intro to Java Notes")
                .description("Java Basics for notes test")
                .difficulty("Basic")
                .build();
        course = courseRepository.save(course);

        testTopic = Topic.builder()
                .course(course)
                .title("Variables")
                .concept("Primitive variables walkthrough")
                .sequenceOrder(1)
                .build();
        testTopic = topicRepository.save(testTopic);
    }

    @AfterEach
    void tearDown() {
        noteRepository.deleteAll();
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
    void testGetEmptyNoteInitially() {
        NoteResponse res = noteService.getNoteByTopic(testUser, testTopic.getId());
        assertNotNull(res);
        assertEquals(testTopic.getId(), res.getTopicId());
        assertEquals("", res.getContent());
        assertNull(res.getId());
    }

    @Test
    void testSaveAndRetrieveNote() {
        // Create note
        NoteRequest req = new NoteRequest();
        req.setTopicId(testTopic.getId());
        req.setContent("My variable notes content here.");

        NoteResponse saved = noteService.saveNote(testUser, req);
        assertNotNull(saved.getId());
        assertEquals(testTopic.getId(), saved.getTopicId());
        assertEquals("My variable notes content here.", saved.getContent());

        // Retrieve note
        NoteResponse retrieved = noteService.getNoteByTopic(testUser, testTopic.getId());
        assertNotNull(retrieved.getId());
        assertEquals(saved.getId(), retrieved.getId());
        assertEquals("My variable notes content here.", retrieved.getContent());
    }

    @Test
    void testOverwriteExistingNote() {
        // Save first note
        NoteRequest req1 = new NoteRequest();
        req1.setTopicId(testTopic.getId());
        req1.setContent("First draft.");
        NoteResponse res1 = noteService.saveNote(testUser, req1);

        // Overwrite note content
        NoteRequest req2 = new NoteRequest();
        req2.setTopicId(testTopic.getId());
        req2.setContent("Second draft content.");
        NoteResponse res2 = noteService.saveNote(testUser, req2);

        // Assertions
        assertEquals(res1.getId(), res2.getId()); // ID should match (it's the same record)
        assertEquals("Second draft content.", res2.getContent());

        // Confirm database contains exactly one note
        assertEquals(1, noteRepository.count());
    }

    @Test
    void testGetAllNotes() {
        // Save first note
        NoteRequest req1 = new NoteRequest();
        req1.setTopicId(testTopic.getId());
        req1.setContent("Note 1 content");
        noteService.saveNote(testUser, req1);

        // Create second topic
        Topic secondTopic = Topic.builder()
                .course(testTopic.getCourse())
                .title("Data Types")
                .concept("Different primitive types")
                .sequenceOrder(2)
                .build();
        secondTopic = topicRepository.save(secondTopic);

        // Save second note
        NoteRequest req2 = new NoteRequest();
        req2.setTopicId(secondTopic.getId());
        req2.setContent("Note 2 content");
        noteService.saveNote(testUser, req2);

        // Fetch all notes
        java.util.List<NoteResponse> allNotes = noteService.getAllNotes(testUser);
        assertEquals(2, allNotes.size());
        assertEquals("Note 2 content", allNotes.get(0).getContent()); // Ordered by updatedAt Desc
        assertEquals(secondTopic.getId(), allNotes.get(0).getTopicId());
        assertEquals("Data Types", allNotes.get(0).getTopicTitle());
        assertEquals("Intro to Java Notes", allNotes.get(0).getCourseTitle());
    }

    @Test
    void testDeleteNote() {
        NoteRequest req = new NoteRequest();
        req.setTopicId(testTopic.getId());
        req.setContent("Content to delete");
        NoteResponse saved = noteService.saveNote(testUser, req);

        // Delete note
        noteService.deleteNote(testUser, saved.getId());

        // Verify
        assertEquals(0, noteRepository.count());
    }

    @Test
    void testDeleteNoteUnauthorized() {
        NoteRequest req = new NoteRequest();
        req.setTopicId(testTopic.getId());
        req.setContent("Content other user");
        NoteResponse saved = noteService.saveNote(testUser, req);

        // Create another user
        User otherUser = User.builder()
                .username("otheruser")
                .email("otheruser@example.com")
                .password("Password123!")
                .build();
        otherUser = userRepository.save(otherUser);

        // Attempt delete
        final User finalOtherUser = otherUser;
        assertThrows(SecurityException.class, () -> {
            noteService.deleteNote(finalOtherUser, saved.getId());
        });
    }
}
