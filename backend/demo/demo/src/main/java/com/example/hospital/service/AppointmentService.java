package com.example.hospital.service;

import com.example.hospital.entity.*;
import com.example.hospital.dto.AppointmentRequest;
import com.example.hospital.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    // 1️⃣ Créer un rendez-vous
    @Transactional
    public Appointment createAppointment(String userEmail, AppointmentRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Patient patient = patientRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Vérifier si le créneau est déjà pris
        if (appointmentRepository.existsByDoctorAndDate(doctor, request.getDate())) {
            throw new RuntimeException("Time slot already booked");
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setDate(request.getDate());
        appointment.setStatus(AppointmentStatus.CONFIRME);

        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Envoyer la notification
        try {
            notificationService.sendAppointmentConfirmation(user.getEmail(), appointment);
        } catch (Exception e) {
            System.out.println("Erreur d'envoi d'email: " + e.getMessage());
        }

        return savedAppointment;
    }

    // 2️⃣ Récupérer les rendez-vous par utilisateur
    public List<Appointment> getMyAppointments(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == Role.PATIENT) {
            Patient patient = patientRepository.findByUser(user)
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            return appointmentRepository.findByPatient(patient);
        } else if (user.getRole() == Role.MEDECIN) {
            Doctor doctor = doctorRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            return appointmentRepository.findByDoctor(doctor);
        }

        return appointmentRepository.findAll();
    }

    // 3️⃣ Récupérer un rendez-vous par ID
    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
    }

    // 4️⃣ Mettre à jour le statut d'un rendez-vous
    @Transactional
    public Appointment updateStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));

        try {
            appointment.setStatus(AppointmentStatus.valueOf(status));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }

        return appointmentRepository.save(appointment);
    }

    // 5️⃣ Ajouter/modifier les notes et prescription
    @Transactional
    public Appointment addConsultationNotes(Long id, String notes, String prescription) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));

        appointment.setConsultationNotes(notes);
        appointment.setPrescription(prescription);

        return appointmentRepository.save(appointment);
    }

    // 6️⃣ Annuler un rendez-vous (médecin/admin)
    @Transactional
    public Appointment cancelAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));

        appointment.setStatus(AppointmentStatus.ANNULE);

        return appointmentRepository.save(appointment);
    }

    // 7️⃣ Annuler un rendez-vous (patient)
    @Transactional
    public void cancelAppointment(Long appointmentId, String userEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Vérifier l'autorisation
        if (user.getRole() == Role.PATIENT) {
            Patient patient = patientRepository.findByUser(user)
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            if (!appointment.getPatient().getId().equals(patient.getId())) {
                throw new RuntimeException("Not authorized");
            }
        }

        appointment.setStatus(AppointmentStatus.ANNULE);
        appointmentRepository.save(appointment);

        // Envoyer la notification d'annulation
        try {
            notificationService.sendCancellationNotification(user.getEmail(), appointment);
        } catch (Exception e) {
            System.out.println("Erreur d'envoi d'email d'annulation: " + e.getMessage());
        }
    }
}