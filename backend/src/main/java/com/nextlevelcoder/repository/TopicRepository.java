package com.nextlevelcoder.repository;

import com.nextlevelcoder.model.Course;
import com.nextlevelcoder.model.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findByCourseOrderBySequenceOrderAsc(Course course);
    List<Topic> findByCourseIdOrderBySequenceOrderAsc(Long courseId);
}
