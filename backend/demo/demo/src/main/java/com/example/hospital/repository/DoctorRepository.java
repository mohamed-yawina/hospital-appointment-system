package com.example.hospital.repository;

import com.example.hospital.entity.Doctor;
import com.example.hospital.entity.Specialty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findBySpecialty(Specialty specialty);
}
