package com.ahmed.jobtracker.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class RequestPasswordResetRequest {

    @NotBlank(message = "Email must not be empty")
    @Email(message = "Invalid email format")
    private String email;

    public RequestPasswordResetRequest() {}

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
