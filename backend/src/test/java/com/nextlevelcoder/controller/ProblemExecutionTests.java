package com.nextlevelcoder.controller;

import com.nextlevelcoder.dto.SubmissionRequest;
import com.nextlevelcoder.dto.SubmissionResponse;
import com.nextlevelcoder.model.*;
import com.nextlevelcoder.repository.*;
import com.nextlevelcoder.security.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class ProblemExecutionTests {

    @Autowired
    private ProblemController problemController;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private CodingProblemRepository codingProblemRepository;

    private User testUser;
    private UserDetailsImpl userDetails;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .username("execuser")
                .email("execuser@example.com")
                .password("Password123!")
                .role("ROLE_USER")
                .build();
        testUser = userRepository.save(testUser);

        Profile profile = Profile.builder()
                .user(testUser)
                .xp(0)
                .level("Beginner")
                .problemsSolved(0)
                .accuracy(0.0)
                .build();
        profileRepository.save(profile);

        userDetails = UserDetailsImpl.build(testUser);
    }

    @Test
    void testHtmlCssCompilation() {
        CodingProblem htmlProblem = CodingProblem.builder()
                .title("Centered Flexbox Card")
                .description("Build a centered flexbox card.")
                .difficulty("Easy")
                .build();
        htmlProblem = codingProblemRepository.save(htmlProblem);

        SubmissionRequest request = new SubmissionRequest();
        request.setLanguage("HTML/CSS");
        request.setCode("<div class=\"card\" style=\"display: flex; justify-content: center; align-items: center;\">Card</div>");

        ResponseEntity<SubmissionResponse> response = problemController.submitSolution(htmlProblem.getId(), userDetails, request);
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("Accepted", response.getBody().getStatus());
    }

    @Test
    void testSqlCompilation() {
        CodingProblem sqlProblem = CodingProblem.builder()
                .title("Duplicate emails")
                .description("Find duplicate emails.")
                .difficulty("Easy")
                .sqlTemplate("SELECT email FROM users;")
                .build();
        sqlProblem = codingProblemRepository.save(sqlProblem);

        SubmissionRequest request = new SubmissionRequest();
        request.setLanguage("SQL");
        request.setCode("SELECT email FROM users GROUP BY email HAVING COUNT(email) > 1 ORDER BY email;");

        ResponseEntity<SubmissionResponse> response = problemController.submitSolution(sqlProblem.getId(), userDetails, request);
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("Accepted", response.getBody().getStatus());
    }

    @Test
    void testJavascriptCompilation() {
        CodingProblem jsProblem = CodingProblem.builder()
                .title("Check palindrome number")
                .description("Verify if odometer reading is a palindrome.")
                .difficulty("Easy")
                .javascriptTemplate("// solve here")
                .build();
        jsProblem = codingProblemRepository.save(jsProblem);

        SubmissionRequest request = new SubmissionRequest();
        request.setLanguage("JavaScript");
        request.setCode("const fs = require('fs');\n" +
                "const input = fs.readFileSync(0, 'utf-8').trim();\n" +
                "const reversed = input.split('').reverse().join('');\n" +
                "if (input === reversed) {\n" +
                "    console.log('Yes');\n" +
                "} else {\n" +
                "    console.log('No');\n" +
                "}");

        ResponseEntity<SubmissionResponse> response = problemController.submitSolution(jsProblem.getId(), userDetails, request);
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getStatus());
    }
}
