package com.nextlevelcoder.service;

import com.nextlevelcoder.dto.NoteRequest;
import com.nextlevelcoder.dto.NoteResponse;
import com.nextlevelcoder.model.Note;
import com.nextlevelcoder.model.Topic;
import com.nextlevelcoder.model.User;
import com.nextlevelcoder.repository.NoteRepository;
import com.nextlevelcoder.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoteServiceImpl implements NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Override
    @Transactional(readOnly = true)
    public NoteResponse getNoteByTopic(User user, Long topicId) {
        return noteRepository.findByUserIdAndTopicId(user.getId(), topicId)
                .map(this::mapToResponse)
                .orElse(NoteResponse.builder()
                        .topicId(topicId)
                        .content("")
                        .build());
    }

    @Override
    @Transactional
    public NoteResponse saveNote(User user, NoteRequest request) {
        Note note = noteRepository.findByUserIdAndTopicId(user.getId(), request.getTopicId())
                .orElseGet(() -> {
                    Topic topic = topicRepository.findById(request.getTopicId())
                            .orElseThrow(() -> new IllegalArgumentException("Topic not found with ID: " + request.getTopicId()));
                    return Note.builder()
                            .user(user)
                            .topic(topic)
                            .build();
                });
        note.setContent(request.getContent());
        Note saved = noteRepository.save(note);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NoteResponse> getAllNotes(User user) {
        return noteRepository.findByUserIdOrderByUpdatedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteNote(User user, Long noteId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("Note not found with ID: " + noteId));
        if (!note.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to delete this note");
        }
        noteRepository.delete(note);
    }

    private NoteResponse mapToResponse(Note note) {
        return NoteResponse.builder()
                .id(note.getId())
                .topicId(note.getTopic().getId())
                .topicTitle(note.getTopic().getTitle())
                .courseId(note.getTopic().getCourse().getId())
                .courseTitle(note.getTopic().getCourse().getTitle())
                .content(note.getContent())
                .updatedAt(note.getUpdatedAt() != null ? note.getUpdatedAt() : note.getCreatedAt())
                .build();
    }
}
