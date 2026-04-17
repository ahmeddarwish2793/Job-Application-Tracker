package com.ahmed.jobtracker.dto.auth;

import jakarta.validation.constraints.NotBlank;

public class ChangePasswordRequest {

    @NotBlank(message = "Old password must be provided")
    private String oldPassword;

    @NotBlank(message = "New password must be provided")
    private String newPassword;

    public ChangePasswordRequest() {}

    public String getOldPassword() {
        return oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
