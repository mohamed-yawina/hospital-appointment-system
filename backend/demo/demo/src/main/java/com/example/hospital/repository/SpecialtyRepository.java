package com.example.hospital.repository;

import com.example.hospital.entity.Specialty;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SpecialtyRepository extends JpaRepository<Specialty, Long> {
    Optional<Specialty> findByName(String name);
}