package com.example.hospital.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long doctorId;
    /** Si renseigné : avis lié à un RDV terminé précis (recommandé). */
    private Long appointmentId;
    private String commentaire;
    private int note;
}
