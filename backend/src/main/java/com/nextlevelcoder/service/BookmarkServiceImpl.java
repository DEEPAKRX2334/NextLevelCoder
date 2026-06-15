package com.nextlevelcoder.service;

import com.nextlevelcoder.dto.BookmarkDto;
import com.nextlevelcoder.model.Bookmark;
import com.nextlevelcoder.model.CodingProblem;
import com.nextlevelcoder.model.Question;
import com.nextlevelcoder.model.User;
import com.nextlevelcoder.repository.BookmarkRepository;
import com.nextlevelcoder.repository.CodingProblemRepository;
import com.nextlevelcoder.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BookmarkServiceImpl implements BookmarkService {

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private CodingProblemRepository codingProblemRepository;

    @Override
    @Transactional(readOnly = true)
    public List<BookmarkDto> getBookmarks(User user) {
        List<Bookmark> bookmarks = bookmarkRepository.findByUser(user);
        List<BookmarkDto> dtos = new ArrayList<>();

        for (Bookmark b : bookmarks) {
            BookmarkDto.BookmarkDtoBuilder builder = BookmarkDto.builder()
                    .id(b.getId())
                    .createdAt(b.getCreatedAt());

            if (b.getCodingProblem() != null) {
                CodingProblem cp = b.getCodingProblem();
                builder.type("CODING")
                       .targetId(cp.getId())
                       .title(cp.getTitle())
                       .description(cp.getDescription());
            } else if (b.getQuestion() != null) {
                Question q = b.getQuestion();
                builder.type("QUIZ")
                       .targetId(q.getId())
                       .title(q.getTitle())
                       .description(q.getDescription());
            }

            dtos.add(builder.build());
        }

        return dtos;
    }

    @Override
    @Transactional
    public boolean toggleQuestionBookmark(User user, Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with ID: " + questionId));

        Optional<Bookmark> existing = bookmarkRepository.findByUserAndQuestion(user, question);
        if (existing.isPresent()) {
            bookmarkRepository.delete(existing.get());
            return false;
        } else {
            Bookmark bookmark = Bookmark.builder()
                    .user(user)
                    .question(question)
                    .build();
            bookmarkRepository.save(bookmark);
            return true;
        }
    }

    @Override
    @Transactional
    public boolean toggleProblemBookmark(User user, Long problemId) {
        CodingProblem problem = codingProblemRepository.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("Coding Problem not found with ID: " + problemId));

        Optional<Bookmark> existing = bookmarkRepository.findByUserAndCodingProblem(user, problem);
        if (existing.isPresent()) {
            bookmarkRepository.delete(existing.get());
            return false;
        } else {
            Bookmark bookmark = Bookmark.builder()
                    .user(user)
                    .codingProblem(problem)
                    .build();
            bookmarkRepository.save(bookmark);
            return true;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isQuestionBookmarked(User user, Long questionId) {
        Question question = questionRepository.findById(questionId).orElse(null);
        if (question == null) return false;
        return bookmarkRepository.existsByUserAndQuestion(user, question);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isProblemBookmarked(User user, Long problemId) {
        CodingProblem problem = codingProblemRepository.findById(problemId).orElse(null);
        if (problem == null) return false;
        return bookmarkRepository.existsByUserAndCodingProblem(user, problem);
    }
}
