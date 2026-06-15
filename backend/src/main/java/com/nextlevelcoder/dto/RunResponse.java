package com.nextlevelcoder.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RunResponse {
    private String status;
    private String stdout;
    private String stderr;
    private Integer executionTimeMs;
    private Integer cpuTimeMs;
    private Double memoryMb;
}
