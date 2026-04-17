package com.ahmed.jobtracker.service;

import com.ahmed.jobtracker.entity.User;
import com.ahmed.jobtracker.exception.BadRequestException;
import com.ahmed.jobtracker.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User uploadProfileImage(MultipartFile file) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow();

        try {

            String fileName =
                    System.currentTimeMillis() + "_" + file.getOriginalFilename();

            Path path = Paths.get("uploads/" + fileName);

            Files.createDirectories(path.getParent());

            Files.write(path, file.getBytes());

            user.setProfileImage(fileName);

            userRepository.save(user);

            return user;

        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image");
        }
    }

    public void changePassword(String oldPassword, String newPassword) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check old password
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new BadRequestException("Old password is incorrect");
        }

        // Encode new password
        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);
    }
}