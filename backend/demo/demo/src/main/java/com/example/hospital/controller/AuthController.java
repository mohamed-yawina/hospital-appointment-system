package com.example.hospital.controller;

import com.example.hospital.dto.*;
import com.example.hospital.entity.User;
import com.example.hospital.security.JwtUtils;
import com.example.hospital.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        String emailNorm = JwtUtils.normalizeEmail(request.getEmail());
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(emailNorm, request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = authService.getUserByEmail(emailNorm);

        // Token JWT : même sujet normalisé que celui utilisé dans JwtAuthFilter / UserDetails
        String token = jwtUtils.generateToken(emailNorm, user.getRole().name());

        System.out.println("🔐 Connexion - Email: " + emailNorm);
        System.out.println("🔐 Rôle: " + user.getRole().name());
        System.out.println("🔐 Token généré: " + token.substring(0, 50) + "...");

        return new LoginResponse(
                token,
                "Bearer",
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }
}