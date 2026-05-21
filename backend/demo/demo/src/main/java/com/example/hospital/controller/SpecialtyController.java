package com.example.hospital.controller;

import com.example.hospital.entity.Specialty;
import com.example.hospital.repository.SpecialtyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/specialties")
@CrossOrigin(origins = "http://localhost:5173")
public class SpecialtyController {

    @Autowired
    private SpecialtyRepository specialtyRepository;

    @GetMapping
    public List<Specialty> listSpecialties() {
        return specialtyRepository.findAll();
    }
}
