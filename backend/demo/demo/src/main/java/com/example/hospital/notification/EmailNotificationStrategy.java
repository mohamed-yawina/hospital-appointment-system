package com.example.hospital.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class EmailNotificationStrategy implements NotificationStrategy {

    private static final Logger log = LoggerFactory.getLogger(EmailNotificationStrategy.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.from:${spring.mail.username:}}")
    private String fromAddress;

    @Override
    public NotificationChannel channel() {
        return NotificationChannel.EMAIL;
    }

    @Override
    public void send(String recipient, String subject, String plainBody) {
        if (recipient == null || recipient.isBlank()) {
            throw new IllegalArgumentException("Destinataire email manquant");
        }
        SimpleMailMessage message = new SimpleMailMessage();
        if (fromAddress != null && !fromAddress.isBlank()) {
            message.setFrom(fromAddress);
        }
        message.setTo(recipient);
        message.setSubject(subject);
        message.setText(plainBody);
        mailSender.send(message);
        log.info("Email envoyé — de: {} | à: {} | sujet: {}", fromAddress, recipient, subject);
    }
}
