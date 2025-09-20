/*
  Warnings:

  - You are about to drop the `leaverequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shiftassignment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `leaverequest` DROP FOREIGN KEY `LeaveRequest_shiftAssignment_id_fkey`;

-- DropForeignKey
ALTER TABLE `shiftassignment` DROP FOREIGN KEY `ShiftAssignment_shift_id_fkey`;

-- DropForeignKey
ALTER TABLE `shiftassignment` DROP FOREIGN KEY `ShiftAssignment_user_id_fkey`;

-- DropTable
DROP TABLE `leaverequest`;

-- DropTable
DROP TABLE `shiftassignment`;

-- CreateTable
CREATE TABLE `Shift_Assignment` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `shift_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Leave_Request` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shiftAssignment_id` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL,
    `approveBy` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Shift_Assignment` ADD CONSTRAINT `Shift_Assignment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shift_Assignment` ADD CONSTRAINT `Shift_Assignment_shift_id_fkey` FOREIGN KEY (`shift_id`) REFERENCES `Shift`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leave_Request` ADD CONSTRAINT `Leave_Request_shiftAssignment_id_fkey` FOREIGN KEY (`shiftAssignment_id`) REFERENCES `Shift_Assignment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
