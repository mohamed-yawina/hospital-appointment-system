package com.example.hospital.controller;

import com.example.hospital.dto.ReviewRequest;
import com.example.hospital.entity.Review;
import com.example.hospital.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public List<Review> listPublishedReviews() {
        return reviewService.listValidatedPublic();
    }

    @PostMapping
    public Review createReview(@RequestBody ReviewRequest body) {
        return reviewService.createReview(getCurrentUserEmail(), body);
    }

    @GetMapping("/me")
    public List<Review> myReviews() {
        return reviewService.listMyReviews(getCurrentUserEmail());
    }

    private String getCurrentUserEmail() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getUsername();
    }
}
