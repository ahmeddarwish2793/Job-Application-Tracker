package com.ahmed.jobtracker.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${SENDGRID_API_KEY}")
    private String sendGridApiKey;

    @Async
    public void sendPasswordResetEmail(String toEmail, String resetLink) {

        Email from = new Email("jobtracker.app.student@gmail.com"); // your verified sender
        String subject = "Password Reset Request";
        Email to = new Email(toEmail);

        Content content = new Content("text/plain",
                "Click the link below to reset your password:\n\n" +
                        resetLink +
                        "\n\nIf you did not request this, ignore this email.");

        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);

            System.out.println("SendGrid Status: " + response.getStatusCode());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}