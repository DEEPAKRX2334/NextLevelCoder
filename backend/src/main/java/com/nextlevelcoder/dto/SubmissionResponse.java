package com.nextlevelcoder.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubmissionResponse {
    private String status;
    private String errorMessage;
    private Integer executionTimeMs;
    private Integer cpuTimeMs;
    private Double memoryMb;
    private Integer xpEarned;
}
