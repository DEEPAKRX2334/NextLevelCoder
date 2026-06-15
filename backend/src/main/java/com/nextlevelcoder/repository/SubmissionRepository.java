package com.nextlevelcoder.repository;

import com.nextlevelcoder.model.CodingProblem;
import com.nextlevelcoder.model.Submission;
import com.nextlevelcoder.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUser(User user);
    List<Submission> findByUserAndCodingProblem(User user, CodingProblem codingProblem);
    boolean existsByUserAndStatusAndCreatedAtAfter(User user, String status, java.time.LocalDateTime createdAt);
}
