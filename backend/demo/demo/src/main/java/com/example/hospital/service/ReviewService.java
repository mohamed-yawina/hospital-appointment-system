package com.example.hospital.service;

import com.example.hospital.dto.ReviewRequest;
import com.example.hospital.entity.*;
import com.example.hospital.repository.AppointmentRepository;
import com.example.hospital.repository.DoctorRepository;
import com.example.hospital.repository.ReviewRepository;
import com.example.hospital.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Transactional(readOnly = true)
    public List<Review> listValidatedPublic() {
        return reviewRepository.findByValidatedTrueWithDetails();
    }

    @Transactional(readOnly = true)
    public List<Review> listAllForAdmin() {
        return reviewRepository.findAllWithDetails();
    }

    /** Avis du patient connecté (tous statuts de validation). */
    @Transactional(readOnly = true)
    public List<Review> listMyReviews(String patientEmail) {
        User user = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!(user instanceof Patient patient)) {
            throw new RuntimeException("Seuls les patients ont des avis ici");
        }
        return reviewRepository.findByPatientOrderByIdDesc(patient);
    }

    @Transactional
    public Review createReview(String patientEmail, ReviewRequest dto) {
        User user = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!(user instanceof Patient patient)) {
            throw new RuntimeException("Seuls les patients peuvent poster un avis");
        }

        if (dto.getNote() < 1 || dto.getNote() > 5) {
            throw new RuntimeException("La note doit être comprise entre 1 et 5");
        }
        if (dto.getCommentaire() == null || dto.getCommentaire().isBlank()) {
            throw new RuntimeException("Le commentaire est requis");
        }

        Doctor doctor;

        if (dto.getAppointmentId() != null) {
            Appointment apt = appointmentRepository.findById(dto.getAppointmentId())
                    .orElseThrow(() -> new RuntimeException("Rendez-vous introuvable"));
            if (!apt.getPatient().getId().equals(patient.getId())) {
                throw new RuntimeException("Ce rendez-vous ne vous appartient pas");
            }
            if (apt.getStatus() != AppointmentStatus.TERMINE) {
                throw new RuntimeException("Seuls les rendez-vous terminés peuvent recevoir un avis");
            }
            if (reviewRepository.existsByAppointment_Id(dto.getAppointmentId())) {
                throw new RuntimeException("Un avis existe déjà pour ce rendez-vous");
            }
            doctor = apt.getDoctor();
            if (dto.getDoctorId() != null && !dto.getDoctorId().equals(doctor.getId())) {
                throw new RuntimeException("Incohérence entre le médecin et le rendez-vous");
            }
        } else {
            if (dto.getDoctorId() == null) {
                throw new RuntimeException("Médecin ou rendez-vous requis");
            }
            doctor = doctorRepository.findById(dto.getDoctorId())
                    .orElseThrow(() -> new RuntimeException("Médecin introuvable"));

            boolean termineExists = appointmentRepository.existsByPatientAndDoctorAndStatus(
                    patient,
                    doctor,
                    AppointmentStatus.TERMINE);

            if (!termineExists) {
                throw new RuntimeException("Uniquement après au moins un rendez-vous terminé avec ce médecin");
            }
        }

        Review review = new Review();
        review.setPatient(patient);
        review.setDoctor(doctor);
        if (dto.getAppointmentId() != null) {
            review.setAppointment(appointmentRepository.getReferenceById(dto.getAppointmentId()));
        }
        review.setCommentaire(dto.getCommentaire().trim());
        review.setNote(dto.getNote());
        review.setValidated(false);

        return reviewRepository.save(review);
    }

    @Transactional
    public Review validateReview(Long reviewId, String adminEmail) {
        User user = userRepository.findByEmailIgnoreCase(
                        adminEmail == null ? "" : adminEmail.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!(user instanceof Administrator)) {
            throw new RuntimeException("La validation nécessite un compte administrateur");
        }
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Avis introuvable"));
        review.setValidated(true);
        return reviewRepository.save(review);
    }

    @Transactional
    public void deleteReview(Long reviewId, String adminEmail) {
        User user = userRepository.findByEmailIgnoreCase(
                        adminEmail == null ? "" : adminEmail.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!(user instanceof Administrator)) {
            throw new RuntimeException("La suppression nécessite un compte administrateur");
        }
        if (!reviewRepository.existsById(reviewId)) {
            throw new RuntimeException("Avis introuvable");
        }
        reviewRepository.deleteById(reviewId);
    }
}
