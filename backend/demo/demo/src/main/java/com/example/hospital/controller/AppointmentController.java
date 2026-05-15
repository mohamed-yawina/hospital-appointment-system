package com.example.hospital.controller;

import com.example.hospital.entity.Appointment;
import com.example.hospital.dto.AppointmentRequest;
import com.example.hospital.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:5173")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // 1️⃣ Créer un rendez-vous
    @PostMapping
    public Appointment createAppointment(@RequestBody AppointmentRequest request) {
        String userEmail = getCurrentUserEmail();
        return appointmentService.createAppointment(userEmail, request);
    }

    // 2️⃣ Récupérer tous les rendez-vous du patient/médecin connecté
    @GetMapping
    public List<Appointment> getMyAppointments() {
        String userEmail = getCurrentUserEmail();
        return appointmentService.getMyAppointments(userEmail);
    }

    // 3️⃣ Récupérer les détails d'un rendez-vous par ID
    @GetMapping("/{id}")
    public Appointment getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id);
    }

    // 4️⃣ Mettre à jour le statut d'un rendez-vous
    @PutMapping("/{id}/status")
    public Appointment updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        return appointmentService.updateStatus(id, status);
    }

    // 5️⃣ Ajouter/modifier les notes et prescription
    @PostMapping("/{id}/notes")
    public Appointment addNotes(@PathVariable Long id, @RequestBody Map<String, String> notes) {
        String consultationNotes = notes.get("notes");
        String prescription = notes.get("prescription");
        return appointmentService.addConsultationNotes(id, consultationNotes, prescription);
    }

    // 6️⃣ Annuler un rendez-vous (médecin/admin)
    @PutMapping("/{id}/cancel")
    public Appointment cancelAppointmentById(@PathVariable Long id) {
        return appointmentService.cancelAppointmentById(id);
    }

    // 7️⃣ Annuler un rendez-vous (patient)
    @DeleteMapping("/{id}")
    public void cancelAppointment(@PathVariable Long id) {
        String userEmail = getCurrentUserEmail();
        appointmentService.cancelAppointment(id, userEmail);
    }

    // Méthode utilitaire pour récupérer l'email de l'utilisateur connecté
    private String getCurrentUserEmail() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getUsername();
    }
}