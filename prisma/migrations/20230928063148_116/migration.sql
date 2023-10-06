-- CreateTable
CREATE TABLE `cancel_reasons` (
    `content` VARCHAR(150) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `requested_user_id` INTEGER NOT NULL,
    `reservation_id` INTEGER NOT NULL,

    UNIQUE INDEX `cancel_reasons_reservation_id_key`(`reservation_id`),
    UNIQUE INDEX `cancel_reasons_reservation_id_requested_user_id_key`(`reservation_id`, `requested_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cancel_reasons` ADD CONSTRAINT `cancel_reasons_requested_user_id_fkey` FOREIGN KEY (`requested_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cancel_reasons` ADD CONSTRAINT `cancel_reasons_reservation_id_fkey` FOREIGN KEY (`reservation_id`) REFERENCES `reservations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
