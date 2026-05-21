package com.example.hospital.controller;

import com.example.hospital.dto.AvailabilityRequest;
import com.example.hospital.entity.Availability;
import com.example.hospital.entity.Doctor;
import com.example.hospital.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    @GetMapping("/{id}")
    public Doctor getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id);
    }

    @GetMapping("/specialty/{specialtyName}")
    public List<Doctor> getDoctorsBySpecialty(@PathVariable String specialtyName) {
        return doctorService.getDoctorsBySpecialty(specialtyName);
    }

    @GetMapping("/{id}/availabilities")
    public List<Availability> getAvailabilities(@PathVariable Long id) {
        return doctorService.listAvailabilities(id);
    }

    @PostMapping("/{id}/availabilities")
    public Availability addAvailability(@PathVariable Long id, @RequestBody AvailabilityRequest request) {
        return doctorService.addAvailability(id, request, getCurrentUserEmail());
    }

    @DeleteMapping("/{id}/availabilities/{availabilityId}")
    public void deleteAvailability(@PathVariable Long id, @PathVariable Long availabilityId) {
        doctorService.deleteAvailability(id, availabilityId, getCurrentUserEmail());
    }

    private String getCurrentUserEmail() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getUsername();
    }
}
