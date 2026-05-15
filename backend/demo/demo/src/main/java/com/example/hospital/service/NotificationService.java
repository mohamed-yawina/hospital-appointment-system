package com.example.hospital.service;


import com.example.hospital.entity.Appointment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendAppointmentConfirmation(String toEmail, Appointment appointment) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Appointment Confirmation");
        message.setText(String.format(
                "Dear Patient,\n\n" +
                        "Your appointment has been confirmed.\n" +
                        "Doctor: %s\n" +
                        "Date: %s\n\n" +
                        "Thank you for using our service.",
                appointment.getDoctor().getUser().getName(),
                appointment.getDate().toString()
        ));
        mailSender.send(message);
    }

    public void sendCancellationNotification(String toEmail, Appointment appointment) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Appointment Cancelled");
        message.setText(String.format(
                "Dear Patient,\n\n" +
                        "Your appointment has been cancelled.\n" +
                        "Doctor: %s\n" +
                        "Date: %s\n\n" +
                        "You can book a new appointment at any time.",
                appointment.getDoctor().getUser().getName(),
                appointment.getDate().toString()
        ));
        mailSender.send(message);
    }
}