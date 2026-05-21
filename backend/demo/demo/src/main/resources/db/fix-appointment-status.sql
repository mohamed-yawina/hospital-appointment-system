-- À exécuter dans hospital_db si les RDV n'apparaissent pas dans l'admin
-- ou si erreur "No enum constant ... AppointmentStatus"

ALTER TABLE appointments
    MODIFY COLUMN status VARCHAR(32) NOT NULL DEFAULT 'EN_ATTENTE';

UPDATE appointments
SET status = 'EN_ATTENTE'
WHERE status IS NULL OR TRIM(status) = '';
