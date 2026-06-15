package com.nextlevelcoder.repository;

import com.nextlevelcoder.model.Bookmark;
import com.nextlevelcoder.model.CodingProblem;
import com.nextlevelcoder.model.Question;
import com.nextlevelcoder.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUser(User user);
    Optional<Bookmark> findByUserAndQuestion(User user, Question question);
    Optional<Bookmark> findByUserAndCodingProblem(User user, CodingProblem codingProblem);
    boolean existsByUserAndQuestion(User user, Question question);
    boolean existsByUserAndCodingProblem(User user, CodingProblem codingProblem);
}
