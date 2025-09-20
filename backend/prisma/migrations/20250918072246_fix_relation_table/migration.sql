/*
  Warnings:

  - You are about to drop the column `approveBy` on the `leave_request` table. All the data in the column will be lost.
  - Added the required column `nurse_id` to the `leave_request` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `leave_request` DROP FOREIGN KEY `leave_request_approveBy_fkey`;

-- DropIndex
DROP INDEX `leave_request_approveBy_fkey` ON `leave_request`;

-- AlterTable
ALTER TABLE `leave_request` DROP COLUMN `approveBy`,
    ADD COLUMN `approve_by` VARCHAR(191) NULL,
    ADD COLUMN `nurse_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `leave_request` ADD CONSTRAINT `leave_request_nurse_id_fkey` FOREIGN KEY (`nurse_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leave_request` ADD CONSTRAINT `leave_request_approve_by_fkey` FOREIGN KEY (`approve_by`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
