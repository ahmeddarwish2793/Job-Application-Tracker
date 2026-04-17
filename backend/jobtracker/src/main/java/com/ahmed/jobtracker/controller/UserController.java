package com.ahmed.jobtracker.controller;

import com.ahmed.jobtracker.dto.auth.ChangePasswordRequest;
import com.ahmed.jobtracker.entity.User;
import com.ahmed.jobtracker.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/profile-image")
    public ResponseEntity<?> uploadProfileImage(
            @RequestParam("file") MultipartFile file) {

        User user = userService.uploadProfileImage(file);

        return ResponseEntity.ok(
                Map.of("profileImage", user.getProfileImage())
        );
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request) {

        userService.changePassword(
                request.getOldPassword(),
                request.getNewPassword()
        );

        return ResponseEntity.ok(
                Map.of("message", "Password changed successfully")
        );
    }
}