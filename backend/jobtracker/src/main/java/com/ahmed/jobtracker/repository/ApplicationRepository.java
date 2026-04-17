package com.ahmed.jobtracker.repository;

import com.ahmed.jobtracker.entity.Application;
import com.ahmed.jobtracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUser(User user);
}
