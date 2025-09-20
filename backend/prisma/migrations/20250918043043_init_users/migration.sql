/*
  Warnings:

  - The values [nurse,head_nurse] on the enum `Users_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('NURSE', 'HEAD_NURSE') NOT NULL;
