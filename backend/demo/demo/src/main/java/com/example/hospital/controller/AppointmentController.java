package com.example.hospital.controller;

import com.example.hospital.dto.AppointmentRequest;
import com.example.hospital.entity.Appointment;
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

    @PostMapping
    public Appointment createAppointment(@RequestBody AppointmentRequest request) {
        String userEmail = getCurrentUserEmail();
        return appointmentService.createAppointment(userEmail, request);
    }

    @GetMapping
    public List<Appointment> getMyAppointments() {
        String userEmail = getCurrentUserEmail();
        return appointmentService.getMyAppointments(userEmail);
    }

    @GetMapping("/{id}")
    public Appointment getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id);
    }

    @PutMapping("/{id}/confirm")
    public Appointment confirmAppointment(@PathVariable Long id) {
        return appointmentService.confirmAppointment(id, getCurrentUserEmail());
    }

    @PutMapping("/{id}/reschedule")
    public Appointment reschedule(@PathVariable Long id, @RequestBody AppointmentRequest request) {
        return appointmentService.rescheduleAppointment(id, request, getCurrentUserEmail());
    }

    @PutMapping("/{id}/status")
    public Appointment updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        return appointmentService.updateStatus(id, status);
    }

    @PostMapping("/{id}/notes")
    public Appointment addNotes(@PathVariable Long id, @RequestBody Map<String, String> notes) {
        String consultationNotes = notes.get("notes");
        String prescription = notes.get("prescription");
        return appointmentService.addConsultationNotes(id, consultationNotes, prescription);
    }

    @PutMapping("/{id}/cancel")
    public Appointment cancelAppointmentById(@PathVariable Long id) {
        return appointmentService.cancelAppointmentById(id);
    }

    @DeleteMapping("/{id}")
    public void cancelAppointment(@PathVariable Long id) {
        String userEmail = getCurrentUserEmail();
        appointmentService.cancelAppointment(id, userEmail);
    }

    private String getCurrentUserEmail() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getUsername();
    }
}
