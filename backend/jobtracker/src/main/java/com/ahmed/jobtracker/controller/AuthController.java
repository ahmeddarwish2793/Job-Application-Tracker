package com.ahmed.jobtracker.controller;

import com.ahmed.jobtracker.dto.auth.*;
import com.ahmed.jobtracker.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    //Register
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        AuthResponse response = service.register(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    //Login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse response = service.login(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("request-reset")
    public ResponseEntity<?> requestResetPassword(
            @Valid @RequestBody RequestPasswordResetRequest request) {

        service.requestPasswordReset(request.getEmail());

        return ResponseEntity.ok(
                Map.of("message", "If the email exists, a reset link has been sent.")
        );
    }

    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        service.resetPassword(request.getToken(), request.getNewPassword());

        return ResponseEntity.ok(
                Map.of("message", "Password reset successful")
        );
    }


}
