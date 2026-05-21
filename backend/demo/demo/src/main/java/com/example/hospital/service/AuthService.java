package com.example.hospital.service;

import com.example.hospital.entity.Administrator;
import com.example.hospital.entity.Doctor;
import com.example.hospital.entity.Patient;
import com.example.hospital.entity.User;
import com.example.hospital.dto.LoginResponse;
import com.example.hospital.dto.RegisterRequest;
import com.example.hospital.repository.UserRepository;
import com.example.hospital.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class AuthService {

    private static String normalizeEmail(String email) {
        if (email == null) {
            return "";
        }
        return email.trim().toLowerCase(Locale.ROOT);
    }

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public LoginResponse authenticate(String email, String password) {
        String key = normalizeEmail(email);
        User user = userRepository.findByEmailIgnoreCase(key)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtils.generateToken(user.getEmail());

        return new LoginResponse(
                token,
                "Bearer",
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    public User register(RegisterRequest request) {
        String emailNorm = normalizeEmail(request.getEmail());
        if (userRepository.existsByEmailIgnoreCase(emailNorm)) {
            throw new RuntimeException("Email already exists");
        }

        String roleTag = request.getRole() != null ? request.getRole().trim() : "";
        User user;
        switch (roleTag) {
            case "PATIENT" -> user = new Patient();
            case "MEDECIN" -> user = new Doctor();
            case "ADMINISTRATEUR" -> user = new Administrator();
            default -> throw new RuntimeException(
                    "Rôle invalide: utilisez PATIENT, MEDECIN ou ADMINISTRATEUR");
        }

        user.setName(request.getName());
        user.setEmail(emailNorm);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userRepository.save(user);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(normalizeEmail(email))
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
}