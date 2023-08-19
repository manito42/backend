/*
  Warnings:

  - The values [REJECT] on the enum `reservations_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `is_mentor` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reservation_id]` on the table `mentee_feedbacks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reservation_id]` on the table `mentor_feedbacks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mentor_profile_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `mentor_profiles` ADD COLUMN `mentoring_count` INTEGER NOT NULL DEFAULT 0,
    MODIFY `isHide` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `reservations` MODIFY `status` ENUM('REQUEST', 'ACCEPT', 'CANCEL', 'PENDING', 'COMPLETE') NOT NULL DEFAULT 'REQUEST';

-- AlterTable
ALTER TABLE `users` DROP COLUMN `is_mentor`,
    ADD COLUMN `mentor_profile_id` INTEGER NULL,
    ADD COLUMN `mentoring_count` INTEGER NOT NULL DEFAULT 0,
    MODIFY `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE UNIQUE INDEX `mentee_feedbacks_reservation_id_key` ON `mentee_feedbacks`(`reservation_id`);

-- CreateIndex
CREATE UNIQUE INDEX `mentor_feedbacks_reservation_id_key` ON `mentor_feedbacks`(`reservation_id`);

-- CreateIndex
CREATE UNIQUE INDEX `users_mentor_profile_id_key` ON `users`(`mentor_profile_id`);
