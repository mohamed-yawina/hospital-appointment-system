package com.example.hospital.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AvailabilityRequest {
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
}
