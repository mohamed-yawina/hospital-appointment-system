package com.example.hospital.repository;

import com.example.hospital.entity.Availability;
import com.example.hospital.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AvailabilityRepository extends JpaRepository<Availability, Long> {

    List<Availability> findByDoctor(Doctor doctor);

    @Query("""
            SELECT COUNT(a) > 0 FROM Availability a
            WHERE a.doctor = :doctor
            AND :slot >= a.dateDebut AND :slot < a.dateFin
            """)
    boolean existsSlotCovering(@Param("doctor") Doctor doctor, @Param("slot") LocalDateTime slot);
}
