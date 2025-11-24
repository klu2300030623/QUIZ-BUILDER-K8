package com.klef.dev.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.klef.dev.model.Result;

import java.util.List;

public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByStudentId(Long studentId);
}
