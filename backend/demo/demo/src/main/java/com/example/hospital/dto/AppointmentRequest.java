package com.example.hospital.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AppointmentRequest {
    private Long doctorId;
    private LocalDateTime date;
}