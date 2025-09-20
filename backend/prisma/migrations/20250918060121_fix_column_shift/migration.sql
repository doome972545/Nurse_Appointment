/*
  Warnings:

  - You are about to drop the column `shiftAssignmentId` on the `leaverequest` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `shift` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `shift` table. All the data in the column will be lost.
  - You are about to drop the column `shiftId` on the `shiftassignment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `shiftassignment` table. All the data in the column will be lost.
  - Added the required column `shiftAssignment_id` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shift_id` to the `ShiftAssignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `ShiftAssignment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `leaverequest` DROP FOREIGN KEY `LeaveRequest_shiftAssignmentId_fkey`;

-- DropForeignKey
ALTER TABLE `shiftassignment` DROP FOREIGN KEY `ShiftAssignment_shiftId_fkey`;

-- DropForeignKey
ALTER TABLE `shiftassignment` DROP FOREIGN KEY `ShiftAssignment_userId_fkey`;

-- DropIndex
DROP INDEX `LeaveRequest_shiftAssignmentId_fkey` ON `leaverequest`;

-- DropIndex
DROP INDEX `ShiftAssignment_shiftId_fkey` ON `shiftassignment`;

-- DropIndex
DROP INDEX `ShiftAssignment_userId_fkey` ON `shiftassignment`;

-- AlterTable
ALTER TABLE `leaverequest` DROP COLUMN `shiftAssignmentId`,
    ADD COLUMN `shiftAssignment_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `shift` DROP COLUMN `endTime`,
    DROP COLUMN `startTime`,
    ADD COLUMN `end_time` VARCHAR(191) NOT NULL,
    ADD COLUMN `start_time` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `shiftassignment` DROP COLUMN `shiftId`,
    DROP COLUMN `userId`,
    ADD COLUMN `shift_id` INTEGER NOT NULL,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `ShiftAssignment` ADD CONSTRAINT `ShiftAssignment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShiftAssignment` ADD CONSTRAINT `ShiftAssignment_shift_id_fkey` FOREIGN KEY (`shift_id`) REFERENCES `Shift`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveRequest` ADD CONSTRAINT `LeaveRequest_shiftAssignment_id_fkey` FOREIGN KEY (`shiftAssignment_id`) REFERENCES `ShiftAssignment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
