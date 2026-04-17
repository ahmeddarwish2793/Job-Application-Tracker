package com.ahmed.jobtracker.service;

import com.ahmed.jobtracker.entity.Application;
import com.ahmed.jobtracker.entity.User;
import com.ahmed.jobtracker.repository.ApplicationRepository;
import com.ahmed.jobtracker.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.Optional;
import com.ahmed.jobtracker.dto.CreateApplicationRequest;
import com.ahmed.jobtracker.dto.ApplicationResponse;
import com.ahmed.jobtracker.dto.UpdateApplicationRequest;
import  com.ahmed.jobtracker.mapper.ApplicationMapper;

import java.util.List;

@Service
public class ApplicationService {
    private final ApplicationRepository repository;
    private final UserRepository userRepository;

    public ApplicationService(ApplicationRepository repository,
                              UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


    public List<ApplicationResponse> getAll() {

        User user = getCurrentUser();

        return repository.findByUser(user)
                .stream()
                .map(ApplicationMapper::toResponse)
                .toList();
    }

    public Optional<Application> getById(Long id) {
        return repository.findById(id);
    }

    public ApplicationResponse create(CreateApplicationRequest request) {

        User user = getCurrentUser();

        Application app = new Application();
        app.setCompany(request.getCompany());
        app.setPosition(request.getPosition());
        app.setStatus(request.getStatus());
        app.setDate(request.getDate());
        app.setUser(user);

        Application saved = repository.save(app);

        return ApplicationMapper.toResponse(saved);
    }
    public void delete(Long id) {

        User user = getCurrentUser();

        Application app = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!app.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        repository.delete(app);
    }

    public ApplicationResponse update(Long id, UpdateApplicationRequest request) {

        User user = getCurrentUser();

        Application app = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!app.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        app.setCompany(request.getCompany());
        app.setPosition(request.getPosition());
        app.setStatus(request.getStatus());
        app.setDate(request.getDate());

        Application updated = repository.save(app);

        return ApplicationMapper.toResponse(updated);
    }
}
