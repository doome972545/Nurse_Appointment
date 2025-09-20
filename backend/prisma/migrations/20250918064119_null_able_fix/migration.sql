-- AlterTable
ALTER TABLE `leave_request` MODIFY `reason` VARCHAR(191) NULL,
    MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NULL;
