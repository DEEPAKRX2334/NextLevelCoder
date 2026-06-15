package com.nextlevelcoder.service;

import com.nextlevelcoder.dto.BookmarkDto;
import com.nextlevelcoder.model.User;

import java.util.List;

public interface BookmarkService {
    List<BookmarkDto> getBookmarks(User user);
    boolean toggleQuestionBookmark(User user, Long questionId);
    boolean toggleProblemBookmark(User user, Long problemId);
    boolean isQuestionBookmarked(User user, Long questionId);
    boolean isProblemBookmarked(User user, Long problemId);
}
