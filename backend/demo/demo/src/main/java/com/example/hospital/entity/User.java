package com.example.hospital.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Utilisateur métier commun (diagramme User abstrait) — stratégie d’héritage JOINED.
 */
@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "dtype", discriminatorType = DiscriminatorType.STRING)
@Data
@NoArgsConstructor
public abstract class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    /**
     * Rôle métier équivalent PATIENT / MEDECIN / ADMINISTRATEUR (pour JWT et Spring Security).
     */
    public Role getRole() {
        if (this instanceof Patient) {
            return Role.PATIENT;
        }
        if (this instanceof Doctor) {
            return Role.MEDECIN;
        }
        if (this instanceof Administrator) {
            return Role.ADMINISTRATEUR;
        }
        throw new IllegalStateException("Type d'utilisateur inconnu pour le registre métier.");
    }
}
