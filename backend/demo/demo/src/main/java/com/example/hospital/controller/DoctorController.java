package com.example.hospital.controller;

import com.example.hospital.entity.Doctor;
import com.example.hospital.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @PutMapping("/{id}/availability")
    public Doctor updateAvailability(@PathVariable Long id, @RequestBody String availability) {
        return doctorService.updateAvailability(id, availability);
    }
}