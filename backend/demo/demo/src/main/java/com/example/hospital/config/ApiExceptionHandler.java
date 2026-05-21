package com.example.hospital.config;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrity(DataIntegrityViolationException ex) {
        String raw = ex.getMostSpecificCause() != null
                ? ex.getMostSpecificCause().getMessage()
                : ex.getMessage();
        if (raw != null && raw.contains("status")) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message",
                    "Erreur base de données sur le statut du rendez-vous. "
                            + "Redémarrez le serveur backend (migration automatique) ou exécutez "
                            + "db/fix-appointment-status.sql dans MySQL."
            ));
        }
        return ResponseEntity.badRequest().body(Map.of(
                "message",
                raw != null ? raw : "Données invalides"
        ));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException ex) {
        String msg = ex.getMessage();
        if (msg != null && msg.contains("AppointmentStatus")) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message",
                    "Statut de rendez-vous invalide en base (ligne vide). "
                            + "Redémarrez le backend ou exécutez db/fix-appointment-status.sql dans MySQL."
            ));
        }
        if (msg != null && msg.contains("Data truncated") && msg.contains("status")) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message",
                    "Le statut EN_ATTENTE n'est pas accepté par la base. Redémarrez le backend pour appliquer la correction automatique."
            ));
        }
        return ResponseEntity.badRequest().body(Map.of("message", msg != null ? msg : "Erreur"));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, String>> handleAuth(AuthenticationException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Authentification requise. Reconnectez-vous."));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "Accès refusé pour cette action."));
    }
}
