package com.klef.dev.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klef.dev.model.Quiz;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    // Optional: add custom queries if needed
    Quiz findByTitle(String title);
}
