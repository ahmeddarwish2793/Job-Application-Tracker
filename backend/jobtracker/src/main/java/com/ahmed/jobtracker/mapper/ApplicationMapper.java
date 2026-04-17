package com.ahmed.jobtracker.mapper;

import com.ahmed.jobtracker.entity.Application;
import com.ahmed.jobtracker.dto.ApplicationResponse;

public class ApplicationMapper {

    public static ApplicationResponse toResponse(Application app) {
        return new ApplicationResponse(
                app.getId(),
                app.getCompany(),
                app.getPosition(),
                app.getStatus(),
                app.getDate()
        );
    }
}