package com.ahmed.jobtracker.service;

import com.ahmed.jobtracker.repository.PasswordResetTokenRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class TokenCleanupService {
    private final PasswordResetTokenRepository tokenRepository;

    public TokenCleanupService(PasswordResetTokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    //Run every 10 minutes
    @Transactional
    @Scheduled(fixedRate = 600000)
    public void cleanupExpiredTokens() {
        tokenRepository.deleteByExpiryDateBefore(LocalDateTime.now());
        System.out.println("Expired reset tokens deleted.");
    }
}
