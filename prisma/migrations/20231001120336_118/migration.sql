-- CreateIndex
CREATE INDEX `reservations_mentor_id_mentee_id_status_idx` ON `reservations`(`mentor_id`, `mentee_id`, `status`);
