package com.nextlevelcoder.service;

import com.nextlevelcoder.dto.NoteRequest;
import com.nextlevelcoder.dto.NoteResponse;
import com.nextlevelcoder.model.User;
import java.util.List;

public interface NoteService {
    NoteResponse getNoteByTopic(User user, Long topicId);
    NoteResponse saveNote(User user, NoteRequest request);
    List<NoteResponse> getAllNotes(User user);
    void deleteNote(User user, Long noteId);
}
