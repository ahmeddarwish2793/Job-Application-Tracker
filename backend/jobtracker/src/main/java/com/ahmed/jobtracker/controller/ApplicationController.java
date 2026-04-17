package com.ahmed.jobtracker.controller;

import com.ahmed.jobtracker.entity.Application;
import com.ahmed.jobtracker.service.ApplicationService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.Optional;
import com.ahmed.jobtracker.dto.CreateApplicationRequest;
import com.ahmed.jobtracker.dto.ApplicationResponse;
import  com.ahmed.jobtracker.dto.UpdateApplicationRequest;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/applications")
@CrossOrigin
public class ApplicationController {

    private final ApplicationService service;

    public ApplicationController(ApplicationService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<ApplicationResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Application> getById(@PathVariable Long id) {

        Optional<Application> app = service.getById(id);

        if (app.isPresent()) {
            return ResponseEntity.ok(app.get());
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<ApplicationResponse> create(
            @Valid @RequestBody CreateApplicationRequest request) {

        ApplicationResponse response = service.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApplicationResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateApplicationRequest request) {

        ApplicationResponse response = service.update(id, request);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        Optional<Application> existing = service.getById(id);

        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}