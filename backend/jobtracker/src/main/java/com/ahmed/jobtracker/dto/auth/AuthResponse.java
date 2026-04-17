package com.ahmed.jobtracker.dto.auth;

public class AuthResponse {

    private String token;
    private String message;
    private String name;
    private String email;
    private String profileImage;


    public AuthResponse() {}

    public AuthResponse(String token, String message, String name, String email, String profileImage) {
        this.token = token;
        this.message = message;
        this.name = name;
        this.email = email;
        this.profileImage = profileImage;
    }

    public String getToken() {
        return token;
    }

    public String getMessage() {
        return message;
    }

    public String getName() {return name;}

    public String getEmail() {return email;}

    public String getProfileImage() {return profileImage;}

    public void setToken(String token) {
        this.token = token;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setName(String name) {this.name = name;}

    public void setEmail(String email) {this.email = email;}

    public void setProfileImage(String profileImage) {this.profileImage = profileImage;}
}