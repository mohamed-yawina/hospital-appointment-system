package com.example.hospital.repository;

import com.example.hospital.entity.Appointment;
import com.example.hospital.entity.AppointmentStatus;
import com.example.hospital.entity.Doctor;
import com.example.hospital.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Query("""
            SELECT DISTINCT a FROM Appointment a
            JOIN FETCH a.patient
            JOIN FETCH a.doctor d
            LEFT JOIN FETCH d.specialty
            ORDER BY a.date DESC
            """)
    List<Appointment> findAllWithDetails();

    List<Appointment> findByPatient(Patient patient);

    List<Appointment> findByDoctor(Doctor doctor);

    boolean existsByDoctorAndDate(Doctor doctor, LocalDateTime date);

    boolean existsByPatientAndDoctorAndStatus(Patient patient, Doctor doctor, AppointmentStatus status);
}
