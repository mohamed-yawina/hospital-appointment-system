package com.example.hospital.service;

import com.example.hospital.entity.Doctor;
import com.example.hospital.entity.Specialty;
import com.example.hospital.repository.DoctorRepository;
import com.example.hospital.repository.SpecialtyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private SpecialtyRepository specialtyRepository;

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    public List<Doctor> getDoctorsBySpecialty(String specialtyName) {
        Specialty specialty = specialtyRepository.findByName(specialtyName)
                .orElseThrow(() -> new RuntimeException("Specialty not found"));
        return doctorRepository.findBySpecialty(specialty);
    }

    public Doctor updateAvailability(Long doctorId, String availability) {
        Doctor doctor = getDoctorById(doctorId);
        doctor.setAvailability(availability);
        return doctorRepository.save(doctor);
    }
}