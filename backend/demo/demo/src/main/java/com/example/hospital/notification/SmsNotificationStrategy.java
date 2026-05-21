package com.example.hospital.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Canal SMS — implémentation bouchonnée jusqu’à intégration d’un fournisseur SMS.
 */
@Component
public class SmsNotificationStrategy implements NotificationStrategy {

    private static final Logger log = LoggerFactory.getLogger(SmsNotificationStrategy.class);

    @Override
    public NotificationChannel channel() {
        return NotificationChannel.SMS;
    }

    @Override
    public void send(String recipient, String subject, String plainBody) {
        log.info("[SMS bouchonné destinataire={}] {} : {}", recipient, subject, plainBody);
    }
}
