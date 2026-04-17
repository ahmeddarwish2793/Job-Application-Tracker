package com.ahmed.jobtracker.dto;

import com.ahmed.jobtracker.entity.ApplicationStatus;

import java.time.LocalDate;
public class ApplicationResponse {

    private Long id;
    private String company;
    private String position;
    private ApplicationStatus status;
    private LocalDate date;

    public ApplicationResponse(Long id, String company, String position, ApplicationStatus status, LocalDate date) {
        this.id = id;
        this.company = company;
        this.position = position;
        this.status = status;
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public String getCompany() {
        return company;
    }

    public String getPosition() {
        return position;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public LocalDate getDate() {
        return date;
    }
}
