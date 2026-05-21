package com.example.hospital.notification;

/**
 * Stratégie d’envoi de notifications (diagramme Strategy).
 */
public interface NotificationStrategy {

    NotificationChannel channel();

    void send(String recipient, String subject, String plainBody);
}
