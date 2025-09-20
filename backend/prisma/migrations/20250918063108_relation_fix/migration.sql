-- DropForeignKey
ALTER TABLE `leave_request` DROP FOREIGN KEY `Leave_Request_shiftAssignment_id_fkey`;

-- AddForeignKey
ALTER TABLE `leave_request` ADD CONSTRAINT `leave_request_shiftAssignment_id_fkey` FOREIGN KEY (`shiftAssignment_id`) REFERENCES `Shift_Assignment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leave_request` ADD CONSTRAINT `leave_request_approveBy_fkey` FOREIGN KEY (`approveBy`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
