package com.example.hospital.service;

import com.example.hospital.entity.Appointment;
import com.example.hospital.notification.NotificationChannel;
import com.example.hospital.notification.NotificationStrategy;
import org.springframework.stereotype.Service;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
public class NotificationService {

    private final Map<NotificationChannel, NotificationStrategy> strategyMap = new EnumMap<>(NotificationChannel.class);

    public NotificationService(List<NotificationStrategy> strategies) {
        for (NotificationStrategy s : strategies) {
            strategyMap.put(s.channel(), s);
        }
    }

    private void sendEmail(String recipient, String subject, String body) {
        NotificationStrategy s = strategyMap.get(NotificationChannel.EMAIL);
        if (s != null) {
            s.send(recipient, subject, body);
        }
    }

    private void invokeStubChannels(String recipientStub, String subject, String body) {
        NotificationStrategy sms = strategyMap.get(NotificationChannel.SMS);
        if (sms != null) {
            sms.send(recipientStub, subject, body);
        }
        NotificationStrategy push = strategyMap.get(NotificationChannel.PUSH);
        if (push != null) {
            push.send(recipientStub, subject, body);
        }
    }

    /**
     * Envoie la confirmation métier vers les canaux (email réel + SMS/PUSH selon stratégies enregistrées).
     */
    public void sendAppointmentConfirmation(String patientEmail, Appointment appointment) {
        String subject = "Rendez-vous confirmé";
        String doctorName = appointment.getDoctor().getName();
        String body = "Bonjour,\n\nVotre rendez-vous est confirmé.\nMédecin : " + doctorName
                + "\nDate : " + appointment.getDate() + "\n\nCordialement.";
        sendEmail(patientEmail, subject, body);
        invokeStubChannels(patientEmail, subject, body);
    }

    public void sendCancellationNotification(String patientEmail, Appointment appointment) {
        String subject = "Annulation du rendez-vous";
        String doctorName = appointment.getDoctor().getName();
        String body = "Bonjour,\n\nVotre rendez-vous a été annulé.\nMédecin : " + doctorName
                + "\nDate prévue : " + appointment.getDate() + "\n\nVous pouvez réserver un nouveau créneau.";
        sendEmail(patientEmail, subject, body);
        invokeStubChannels(patientEmail, subject, body);
    }
}
