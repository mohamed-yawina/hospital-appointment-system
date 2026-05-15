package com.example.hospital.repository;


import com.example.hospital.entity.Doctor;
import com.example.hospital.entity.Specialty;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecialty(Specialty specialty);
    Optional<Doctor> findByUserId(Long userId);
}