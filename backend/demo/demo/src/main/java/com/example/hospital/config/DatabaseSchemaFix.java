package com.example.hospital.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Corrige la colonne {@code appointments.status} (ENUM obsolète, valeurs vides invalides pour JPA).
 */
@Component
public class DatabaseSchemaFix implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSchemaFix.class);

    private final JdbcTemplate jdbcTemplate;

    public DatabaseSchemaFix(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        fixStatusColumnType();
        fixInvalidStatusValues();
    }

    private void fixStatusColumnType() {
        try {
            String columnType = jdbcTemplate.queryForObject(
                    """
                    SELECT COLUMN_TYPE FROM information_schema.COLUMNS
                    WHERE TABLE_SCHEMA = DATABASE()
                      AND TABLE_NAME = 'appointments'
                      AND COLUMN_NAME = 'status'
                    """,
                    String.class);

            if (columnType != null && columnType.toLowerCase().startsWith("enum")) {
                log.info("Migration appointments.status : {} -> VARCHAR(32)", columnType);
                jdbcTemplate.execute(
                        """
                        ALTER TABLE appointments
                        MODIFY COLUMN status VARCHAR(32) NOT NULL DEFAULT 'EN_ATTENTE'
                        """
                );
                log.info("Colonne appointments.status convertie en VARCHAR(32).");
            }
        } catch (Exception e) {
            log.warn("Migration type appointments.status : {}", e.getMessage());
        }
    }

    /** Lignes avec status vide → EN_ATTENTE (sinon JPA lève No enum constant …). */
    private void fixInvalidStatusValues() {
        try {
            int updated = jdbcTemplate.update(
                    """
                    UPDATE appointments
                    SET status = 'EN_ATTENTE'
                    WHERE status IS NULL
                       OR TRIM(status) = ''
                    """
            );
            if (updated > 0) {
                log.info("Corrigé {} rendez-vous avec statut vide → EN_ATTENTE.", updated);
            }
        } catch (Exception e) {
            log.warn("Correction statuts appointments : {}", e.getMessage());
        }
    }
}
