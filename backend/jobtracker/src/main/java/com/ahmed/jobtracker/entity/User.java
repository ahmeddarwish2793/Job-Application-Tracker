package com.ahmed.jobtracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
public class User {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Email must be given")
    @Email(message = "Invalid email format")
    private String email;

    @Column(nullable = false)
    @NotBlank(message = "Name must be given")
    private String name;

    @Column(nullable = false)
    @NotBlank(message = "Password must be given")
    private String password;

    @OneToMany(mappedBy = "user")
    private List<Application> applications;

    private LocalDateTime createdAt;

    private String role;

    @Column(name = "profile_image")
    private String profileImage;

    // Constructors
    public User() {}

    public User(String email, String name, String password, String role, String profileImage) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.role = role;
        this.createdAt = LocalDateTime.now();
        this.profileImage = profileImage;
    }

    // Getters

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getPassword() {
        return password;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getRole() {
        return role;
    }

    public String getProfileImage() {return profileImage;}


// Setters

    public void setId(Long id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setProfileImage(String profileImage) {this.profileImage = profileImage;}
}
