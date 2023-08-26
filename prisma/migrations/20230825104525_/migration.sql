/*
  Warnings:

  - The values [PENDING] on the enum `reservations_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `reservations` MODIFY `status` ENUM('REQUEST', 'ACCEPT', 'CANCEL', 'MENTEE_FEEDBACK_COMPLETE', 'COMPLETE') NOT NULL DEFAULT 'REQUEST';
