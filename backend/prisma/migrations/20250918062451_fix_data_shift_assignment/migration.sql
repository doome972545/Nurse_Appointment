/*
  Warnings:

  - You are about to alter the column `shiftAssignment_id` on the `leave_request` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `shift_assignment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `shift_assignment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `leave_request` DROP FOREIGN KEY `Leave_Request_shiftAssignment_id_fkey`;

-- DropIndex
DROP INDEX `Leave_Request_shiftAssignment_id_fkey` ON `leave_request`;

-- AlterTable
ALTER TABLE `leave_request` MODIFY `shiftAssignment_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `shift_assignment` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Leave_Request` ADD CONSTRAINT `Leave_Request_shiftAssignment_id_fkey` FOREIGN KEY (`shiftAssignment_id`) REFERENCES `Shift_Assignment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
