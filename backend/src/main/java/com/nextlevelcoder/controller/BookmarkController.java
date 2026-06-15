package com.nextlevelcoder.controller;

import com.nextlevelcoder.dto.BookmarkDto;
import com.nextlevelcoder.model.User;
import com.nextlevelcoder.repository.UserRepository;
import com.nextlevelcoder.security.UserDetailsImpl;
import com.nextlevelcoder.service.BookmarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    @Autowired
    private BookmarkService bookmarkService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<BookmarkDto>> getBookmarks(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        List<BookmarkDto> bookmarks = bookmarkService.getBookmarks(user);
        return ResponseEntity.ok(bookmarks);
    }

    @PostMapping("/problem/{id}")
    public ResponseEntity<Map<String, Boolean>> toggleProblemBookmark(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        boolean bookmarked = bookmarkService.toggleProblemBookmark(user, id);

        Map<String, Boolean> response = new HashMap<>();
        response.put("bookmarked", bookmarked);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/question/{id}")
    public ResponseEntity<Map<String, Boolean>> toggleQuestionBookmark(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        boolean bookmarked = bookmarkService.toggleQuestionBookmark(user, id);

        Map<String, Boolean> response = new HashMap<>();
        response.put("bookmarked", bookmarked);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkBookmark(
            @RequestParam(required = false) Long problemId,
            @RequestParam(required = false) Long questionId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        boolean bookmarked = false;

        if (problemId != null) {
            bookmarked = bookmarkService.isProblemBookmarked(user, problemId);
        } else if (questionId != null) {
            bookmarked = bookmarkService.isQuestionBookmarked(user, questionId);
        }

        Map<String, Boolean> response = new HashMap<>();
        response.put("bookmarked", bookmarked);
        return ResponseEntity.ok(response);
    }
}
