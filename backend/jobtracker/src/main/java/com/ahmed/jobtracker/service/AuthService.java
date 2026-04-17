package com.ahmed.jobtracker.service;

import com.ahmed.jobtracker.dto.auth.RegisterRequest;
import com.ahmed.jobtracker.dto.auth.LoginRequest;
import com.ahmed.jobtracker.dto.auth.AuthResponse;
import com.ahmed.jobtracker.entity.PasswordResetToken;
import com.ahmed.jobtracker.entity.User;
import com.ahmed.jobtracker.exception.BadRequestException;
import com.ahmed.jobtracker.repository.PasswordResetTokenRepository;
import com.ahmed.jobtracker.repository.UserRepository;
import com.ahmed.jobtracker.security.JwtService;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;


@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private final PasswordResetTokenRepository tokenRepository;

    private final EmailService emailService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       PasswordResetTokenRepository tokenRepository,
                       EmailService emailService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
    }

    //Register
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Email already registered"
            );
        }

        String encodedPassword =
                passwordEncoder.encode(request.getPassword());

        User user = new User(
                request.getEmail(),
                request.getName(),
                encodedPassword,
                "ROLE_USER",
                null
        );

        userRepository.save(user);

        return new AuthResponse(
                null,
                "User registered successfully",
                null,
                null,
                null
        );
    }

    //Login
    public AuthResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Invalid email or password"
                        )
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        String token =
                jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                "Login successful",
                user.getName(),
                user.getEmail(),
                user.getProfileImage()
        );
    }

    // Request password reset because of forgetting password
    public void requestPasswordReset(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        //Always return success response to prevent email enumeration, which is attack to know
        // if user is registered on this website or not
        if (optionalUser.isEmpty()) {
            return;
        }

        User user = optionalUser.get();

        //Generate secure random token
        String token = java.util.UUID.randomUUID().toString();

        //Set expiration time, 15 minutes from generation
        LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(15);

        PasswordResetToken passwordResetToken = new PasswordResetToken(token, expiryDate, user);
        tokenRepository.save(passwordResetToken);

        //Simulate sending email
        String resetLink = "http://localhost:8081/pages/reset-password.html?token=" + token;

        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
    }

    public void resetPassword(String token, String newPassword) {

        //Getting the object reset token from database, if not found throw exception
        PasswordResetToken resetToken = tokenRepository
                .findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid reset token")
                );

        //Check if token is expired
        if(resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(resetToken);
            throw new BadRequestException("Reset token expired");
        }

        //Hashing and saving the new password to the corresponding user
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
    }
}
