package com.example.hospital.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Administrateur (diagramme Administrateur étendant User).
 */
@Entity
@Table(name = "administrators")
@Data
@NoArgsConstructor
public class Administrator extends User {
}
