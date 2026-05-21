package com.example.hospital.controller;

import com.example.hospital.entity.Appointment;
import com.example.hospital.entity.Review;
import com.example.hospital.entity.User;
import com.example.hospital.service.AdminService;
import com.example.hospital.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/users")
    public List<User> listUsers() {
        return adminService.findAllUsers();
    }

    @GetMapping("/appointments")
    public List<Appointment> listAppointments() {
        return adminService.findAllAppointments();
    }

    @GetMapping("/reviews")
    public List<Review> listReviews() {
        return reviewService.listAllForAdmin();
    }

    @PutMapping("/reviews/{reviewId}/validate")
    public Review validateReview(@PathVariable Long reviewId) {
        UserDetails principal = (UserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return reviewService.validateReview(reviewId, principal.getUsername());
    }

    @DeleteMapping("/reviews/{reviewId}")
    public void deleteReview(@PathVariable Long reviewId) {
        UserDetails principal = (UserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        reviewService.deleteReview(reviewId, principal.getUsername());
    }

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