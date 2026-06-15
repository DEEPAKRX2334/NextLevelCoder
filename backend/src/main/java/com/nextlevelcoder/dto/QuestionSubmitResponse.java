package com.nextlevelcoder.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionSubmitResponse {
    private boolean correct;
    private String correctAnswer;
    private int xpEarned;
}
