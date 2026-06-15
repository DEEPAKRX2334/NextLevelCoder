package com.nextlevelcoder.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoteResponse {
    private Long id;
    private Long topicId;
    private String topicTitle;
    private Long courseId;
    private String courseTitle;
    private String content;
    private LocalDateTime updatedAt;
}
