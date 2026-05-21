package com.example.hospital.service;

import com.example.hospital.dto.AppointmentRequest;
import com.example.hospital.entity.*;
import com.example.hospital.repository.AppointmentRepository;
import com.example.hospital.repository.AvailabilityRepository;
import com.example.hospital.repository.DoctorRepository;
import com.example.hospital.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentService {

    private static final Logger log = LoggerFactory.getLogger(AppointmentService.class);

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AvailabilityRepository availabilityRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Transactional
    public Appointment createAppointment(String userEmail, AppointmentRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!(user instanceof Patient patient)) {
            throw new RuntimeException("Seuls les patients peuvent demander un rendez-vous");
        }

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (!availabilityRepository.existsSlotCovering(doctor, request.getDate())) {
            throw new RuntimeException("Ce créneau ne correspond pas à une disponibilité du médecin");
        }

        if (appointmentRepository.existsByDoctorAndDate(doctor, request.getDate())) {
            throw new RuntimeException("Créneau déjà réservé");
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setDate(request.getDate());
        appointment.setStatus(AppointmentStatus.EN_ATTENTE);

        return appointmentRepository.save(appointment);
    }

    /**
     * Confirme un rendez-vous (diagramme RDV.confirmé après EN_ATTENTE).
     */
    @Transactional
    public Appointment confirmAppointment(Long id, String actorEmail) {
        User actor = userRepository.findByEmail(actorEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));

        boolean allowed = actor instanceof Administrator
                || (actor instanceof Doctor doctor && appointment.getDoctor().getId().equals(doctor.getId()));
        if (!allowed) {
            throw new RuntimeException("Seul le médecin ou l'admin peut confirmer ce rendez-vous");
        }

        if (appointment.getStatus() != AppointmentStatus.EN_ATTENTE) {
            throw new RuntimeException("Seuls les rendez-vous EN_ATTENTE peuvent être confirmés");
        }

        AppointmentStatus previous = appointment.getStatus();
        appointment.setStatus(AppointmentStatus.CONFIRME);
        Appointment saved = appointmentRepository.save(appointment);
        trySendStatusEmail(saved, previous);
        return saved;
    }

    /**
     * Envoie un email au patient lors d'un passage vers CONFIRME ou ANNULE.
     * Les erreurs SMTP sont journalisées mais n'empêchent pas la mise à jour du statut.
     */
    private void trySendStatusEmail(Appointment saved, AppointmentStatus previousStatus) {
        AppointmentStatus newStatus = saved.getStatus();
        String patientEmail = saved.getPatient().getEmail();
        try {
            if (newStatus == AppointmentStatus.CONFIRME && previousStatus != AppointmentStatus.CONFIRME) {
                notificationService.sendAppointmentConfirmation(patientEmail, saved);
            } else if (newStatus == AppointmentStatus.ANNULE && previousStatus != AppointmentStatus.ANNULE) {
                notificationService.sendCancellationNotification(patientEmail, saved);
            }
        } catch (Exception e) {
            log.error(
                    "Échec envoi email à {} ({} → {}) : {}",
                    patientEmail,
                    previousStatus,
                    newStatus,
                    e.getMessage(),
                    e
            );
        }
    }

    /**
     * Reprogramme le créneau (diagramme RDV.reprogrammer) — même médecin, nouveau horaire sous réserve disponibilités.
     */
    @Transactional
    public Appointment rescheduleAppointment(Long id, AppointmentRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));

        boolean allowed = user instanceof Administrator
                || (user instanceof Patient patient && appointment.getPatient().getId().equals(patient.getId()))
                || (user instanceof Doctor doctor && appointment.getDoctor().getId().equals(doctor.getId()));
        if (!allowed) {
            throw new RuntimeException("Modification non autorisée");
        }

        if (appointment.getStatus() == AppointmentStatus.ANNULE || appointment.getStatus() == AppointmentStatus.TERMINE) {
            throw new RuntimeException("Impossible de reprogrammer un rendez-vous annulé ou terminé");
        }

        Doctor doctor = appointment.getDoctor();
        LocalDateTime newDate = request.getDate();
        if (!availabilityRepository.existsSlotCovering(doctor, newDate)) {
            throw new RuntimeException("Créneau hors disponibilité du médecin");
        }

        if (!newDate.equals(appointment.getDate())
                && appointmentRepository.existsByDoctorAndDate(doctor, newDate)) {
            throw new RuntimeException("Créneau déjà réservé");
        }

        appointment.setDate(newDate);
        appointment.setStatus(AppointmentStatus.EN_ATTENTE);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getMyAppointments(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user instanceof Patient patient) {
            return appointmentRepository.findByPatient(patient);
        }
        if (user instanceof Doctor doctor) {
            return appointmentRepository.findByDoctor(doctor);
        }
        if (user instanceof Administrator) {
            return appointmentRepository.findAllWithDetails();
        }

        return appointmentRepository.findAllWithDetails();
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
    }

    @Transactional
    public Appointment updateStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));

        AppointmentStatus previous = appointment.getStatus();
        try {
            appointment.setStatus(AppointmentStatus.valueOf(status));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }

        Appointment saved = appointmentRepository.save(appointment);
        trySendStatusEmail(saved, previous);
        return saved;
    }

    @Transactional
    public Appointment addConsultationNotes(Long id, String notes, String prescription) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));

        appointment.setConsultationNotes(notes);
        appointment.setPrescription(prescription);

        return appointmentRepository.save(appointment);
    }

    @Transactional
    public Appointment cancelAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));

        AppointmentStatus previous = appointment.getStatus();
        appointment.setStatus(AppointmentStatus.ANNULE);
        Appointment saved = appointmentRepository.save(appointment);
        trySendStatusEmail(saved, previous);
        return saved;
    }

    @Transactional
    public void cancelAppointment(Long appointmentId, String userEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user instanceof Patient patient) {
            if (!appointment.getPatient().getId().equals(patient.getId())) {
                throw new RuntimeException("Not authorized");
            }
        }

        AppointmentStatus previous = appointment.getStatus();
        appointment.setStatus(AppointmentStatus.ANNULE);
        Appointment saved = appointmentRepository.save(appointment);
        trySendStatusEmail(saved, previous);
    }
}
