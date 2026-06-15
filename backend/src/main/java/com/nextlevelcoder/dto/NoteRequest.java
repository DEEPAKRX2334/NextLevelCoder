package com.nextlevelcoder.dto;

import lombok.Data;

@Data
public class NoteRequest {
    private Long topicId;
    private String content;
}
