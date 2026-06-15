package com.nextlevelcoder.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "coding_problems")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodingProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "question_id")
    private Long questionId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Builder.Default
    @Column(length = 20)
    private String difficulty = "Easy";

    @Column(columnDefinition = "TEXT")
    private String constraints;

    @Builder.Default
    @Column(name = "time_limit_ms")
    private Integer timeLimitMs = 2000;

    @Builder.Default
    @Column(name = "memory_limit_mb")
    private Integer memoryLimitMb = 128;

    @Column(name = "java_template", columnDefinition = "TEXT")
    private String javaTemplate;

    @Column(name = "javascript_template", columnDefinition = "TEXT")
    private String javascriptTemplate;

    @Column(name = "sql_template", columnDefinition = "TEXT")
    private String sqlTemplate;

    @Transient
    private String schemaSql;

    @Transient
    private String category;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
