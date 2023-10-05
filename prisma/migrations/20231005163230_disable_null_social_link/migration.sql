/*
  Warnings:

  - Made the column `socialLink` on table `mentor_profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `mentor_profiles` MODIFY `socialLink` VARCHAR(255) NOT NULL;
