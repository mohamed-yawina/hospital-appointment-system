package com.example.hospital.controller;

import com.example.hospital.entity.Doctor;
import com.example.hospital.entity.Specialty;
import com.example.hospital.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/specialties")
    public void addSpecialty(@RequestBody String name) {
        adminService.addSpecialty(name);
    }

    @PutMapping("/doctors/{doctorId}/specialty/{specialtyId}")
    public void assignSpecialty(@PathVariable Long doctorId, @PathVariable Long specialtyId) {
        adminService.assignSpecialtyToDoctor(doctorId, specialtyId);
    }

    @GetMapping("/statistics")
    public Map<String, Object> getStatistics() {
        return adminService.getStatistics();
    }

    @DeleteMapping("/users/{userId}")
    public void deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
    }
}