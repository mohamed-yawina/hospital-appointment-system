package com.example.hospital.repository;

import com.example.hospital.entity.Patient;
import com.example.hospital.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("""
            SELECT DISTINCT r FROM Review r
            JOIN FETCH r.patient
            JOIN FETCH r.doctor d
            LEFT JOIN FETCH d.specialty
            ORDER BY r.id DESC
            """)
    List<Review> findAllWithDetails();

    @Query("""
            SELECT DISTINCT r FROM Review r
            JOIN FETCH r.patient
            JOIN FETCH r.doctor d
            LEFT JOIN FETCH d.specialty
            WHERE r.validated = true
            ORDER BY r.id DESC
            """)
    List<Review> findByValidatedTrueWithDetails();

    List<Review> findByValidatedTrue();

    List<Review> findByPatientOrderByIdDesc(Patient patient);

    boolean existsByAppointment_Id(Long appointmentId);
}
