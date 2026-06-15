package com.nextlevelcoder.repository;

import com.nextlevelcoder.model.Question;
import com.nextlevelcoder.model.QuizSubmission;
import com.nextlevelcoder.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizSubmissionRepository extends JpaRepository<QuizSubmission, Long> {
    List<QuizSubmission> findByUser(User user);
    boolean existsByUserAndQuestionAndCorrect(User user, Question question, boolean correct);
    boolean existsByUserAndCreatedAtAfter(User user, java.time.LocalDateTime createdAt);
}
