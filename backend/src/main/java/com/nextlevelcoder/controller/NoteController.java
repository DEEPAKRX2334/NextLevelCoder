package com.nextlevelcoder.controller;

import com.nextlevelcoder.dto.NoteRequest;
import com.nextlevelcoder.dto.NoteResponse;
import com.nextlevelcoder.model.User;
import com.nextlevelcoder.repository.UserRepository;
import com.nextlevelcoder.security.UserDetailsImpl;
import com.nextlevelcoder.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notes")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<NoteResponse>> getAllNotes(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        List<NoteResponse> responses = noteService.getAllNotes(user);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/topic/{topicId}")
    public ResponseEntity<NoteResponse> getNote(
            @PathVariable Long topicId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        NoteResponse response = noteService.getNoteByTopic(user, topicId);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<NoteResponse> saveNote(
            @RequestBody NoteRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        if (request.getTopicId() == null) {
            return ResponseEntity.badRequest().build();
        }
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        NoteResponse response = noteService.saveNote(user, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        try {
            noteService.deleteNote(user, id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        }
    }
}
