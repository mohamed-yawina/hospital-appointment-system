package com.example.hospital.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Notifications push — bouchonné (FCM/APNs hors périmètre).
 */
@Component
public class PushNotificationStrategy implements NotificationStrategy {

    private static final Logger log = LoggerFactory.getLogger(PushNotificationStrategy.class);

    @Override
    public NotificationChannel channel() {
        return NotificationChannel.PUSH;
    }

    @Override
    public void send(String recipient, String subject, String plainBody) {
        log.info("[PUSH bouchonné destinataire={}] {} : {}", recipient, subject, plainBody);
    }
}
