/*
  Warnings:

  - The values [pending,approved,rejected] on the enum `LeaveRequest_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `leaverequest` MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL;
