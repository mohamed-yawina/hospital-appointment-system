package com.example.hospital.service;

import com.example.hospital.dto.AvailabilityRequest;
import com.example.hospital.entity.Administrator;
import com.example.hospital.entity.Availability;
import com.example.hospital.entity.Doctor;
import com.example.hospital.entity.Specialty;
import com.example.hospital.entity.User;
import com.example.hospital.repository.AvailabilityRepository;
import com.example.hospital.repository.DoctorRepository;
import com.example.hospital.repository.SpecialtyRepository;
import com.example.hospital.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private SpecialtyRepository specialtyRepository;

    @Autowired
    private AvailabilityRepository availabilityRepository;

    @Autowired
    private UserRepository userRepository;

    private void authorizeDoctorAvailabilityChanges(User actor, Doctor doctor) {
        if (actor instanceof Administrator) {
            return;
        }
        if (actor instanceof Doctor self && self.getId().equals(doctor.getId())) {
            return;
        }
        throw new RuntimeException("Modification des disponibilités non autorisée");
    }

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

    public List<Availability> listAvailabilities(Long doctorId) {
        Doctor doctor = getDoctorById(doctorId);
        return availabilityRepository.findByDoctor(doctor);
    }

    @Transactional
    public Availability addAvailability(Long doctorId, AvailabilityRequest request, String actorEmail) {
        Doctor doctor = getDoctorById(doctorId);
        User actor = userRepository.findByEmail(actorEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        authorizeDoctorAvailabilityChanges(actor, doctor);
        if (request.getDateDebut() == null || request.getDateFin() == null) {
            throw new RuntimeException("dateDebut et dateFin sont requis");
        }
        if (!request.getDateFin().isAfter(request.getDateDebut())) {
            throw new RuntimeException("dateFin doit être strictement après dateDebut");
        }
        Availability availability = new Availability();
        availability.setDoctor(doctor);
        availability.setDateDebut(request.getDateDebut());
        availability.setDateFin(request.getDateFin());
        return availabilityRepository.save(availability);
    }

    @Transactional
    public void deleteAvailability(Long doctorId, Long availabilityId, String actorEmail) {
        Doctor doctor = getDoctorById(doctorId);
        User actor = userRepository.findByEmail(actorEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        authorizeDoctorAvailabilityChanges(actor, doctor);
        Availability availability = availabilityRepository.findById(availabilityId)
                .orElseThrow(() -> new RuntimeException("Disponibilité introuvable"));
        if (!availability.getDoctor().getId().equals(doctor.getId())) {
            throw new RuntimeException("Cette disponibilité n'appartient pas au médecin indiqué");
        }
        availabilityRepository.delete(availability);
    }
}
