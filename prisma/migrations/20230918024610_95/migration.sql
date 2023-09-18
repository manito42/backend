/*
  Warnings:

  - Made the column `shortDescription` on table `mentor_profiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `mentor_profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `mentor_profiles` MODIFY `shortDescription` VARCHAR(255) NOT NULL,
    MODIFY `description` TEXT NOT NULL;
