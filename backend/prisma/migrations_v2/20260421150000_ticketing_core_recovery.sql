CREATE TABLE IF NOT EXISTS `payment_webhook_events` (
    `id` CHAR(36) NOT NULL,
    `provider` VARCHAR(64) NOT NULL,
    `event_reference` VARCHAR(128) NULL,
    `signature_valid` BOOLEAN NOT NULL DEFAULT false,
    `processing_status` VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    `payload` JSON NOT NULL,
    `error_message` VARCHAR(255) NULL,
    `processed_at` DATETIME(3) NULL,
    `payment_id` CHAR(36) NULL,
    `order_id` CHAR(36) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `payment_webhook_events_processing_status_created_at_idx`(`processing_status`, `created_at`),
    INDEX `payment_webhook_events_payment_id_idx`(`payment_id`),
    INDEX `payment_webhook_events_order_id_idx`(`order_id`),
    UNIQUE INDEX `payment_webhook_events_provider_event_reference_key`(`provider`, `event_reference`),
    PRIMARY KEY (`id`),
    CONSTRAINT `payment_webhook_events_payment_id_fkey`
      FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `payment_webhook_events_order_id_fkey`
      FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tickets` (
    `id` CHAR(36) NOT NULL,
    `order_id` CHAR(36) NOT NULL,
    `order_item_id` CHAR(36) NOT NULL,
    `event_id` CHAR(36) NOT NULL,
    `ticket_type_id` CHAR(36) NOT NULL,
    `ticket_code` VARCHAR(64) NOT NULL,
    `qr_token` VARCHAR(128) NOT NULL,
    `participant_first_name` VARCHAR(100) NULL,
    `participant_last_name` VARCHAR(100) NULL,
    `participant_email` VARCHAR(191) NULL,
    `participant_phone` VARCHAR(32) NULL,
    `status` ENUM('GENERATED', 'USED', 'CANCELLED') NOT NULL DEFAULT 'GENERATED',
    `checked_in_at` DATETIME(3) NULL,
    `cancelled_at` DATETIME(3) NULL,
    `metadata` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tickets_ticket_code_key`(`ticket_code`),
    UNIQUE INDEX `tickets_qr_token_key`(`qr_token`),
    INDEX `tickets_event_id_status_idx`(`event_id`, `status`),
    INDEX `tickets_ticket_type_id_status_idx`(`ticket_type_id`, `status`),
    PRIMARY KEY (`id`),
    CONSTRAINT `tickets_order_id_fkey`
      FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `tickets_order_item_id_fkey`
      FOREIGN KEY (`order_item_id`) REFERENCES `order_items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `tickets_event_id_fkey`
      FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `tickets_ticket_type_id_fkey`
      FOREIGN KEY (`ticket_type_id`) REFERENCES `ticket_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ticket_scans` (
    `id` CHAR(36) NOT NULL,
    `ticket_id` CHAR(36) NOT NULL,
    `scanned_by_id` CHAR(36) NOT NULL,
    `scan_result` ENUM('SUCCESS', 'ALREADY_USED', 'INVALID', 'CANCELLED_TICKET', 'EVENT_MISMATCH') NOT NULL,
    `scanner_device` VARCHAR(128) NULL,
    `scanner_ip` VARCHAR(64) NULL,
    `payload` JSON NULL,
    `scanned_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ticket_scans_ticket_id_scanned_at_idx`(`ticket_id`, `scanned_at`),
    INDEX `ticket_scans_scanned_by_id_scanned_at_idx`(`scanned_by_id`, `scanned_at`),
    PRIMARY KEY (`id`),
    CONSTRAINT `ticket_scans_ticket_id_fkey`
      FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `ticket_scans_scanned_by_id_fkey`
      FOREIGN KEY (`scanned_by_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `raffle_tickets` (
    `id` CHAR(36) NOT NULL,
    `order_id` CHAR(36) NOT NULL,
    `ticket_id` CHAR(36) NULL,
    `serial_number` VARCHAR(64) NOT NULL,
    `status` ENUM('ASSIGNED', 'CANCELLED', 'WINNER') NOT NULL DEFAULT 'ASSIGNED',
    `assigned_to` VARCHAR(191) NULL,
    `prize_label` VARCHAR(191) NULL,
    `drawn_at` DATETIME(3) NULL,
    `metadata` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `raffle_tickets_ticket_id_key`(`ticket_id`),
    UNIQUE INDEX `raffle_tickets_serial_number_key`(`serial_number`),
    INDEX `raffle_tickets_order_id_idx`(`order_id`),
    INDEX `raffle_tickets_status_drawn_at_idx`(`status`, `drawn_at`),
    PRIMARY KEY (`id`),
    CONSTRAINT `raffle_tickets_order_id_fkey`
      FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `raffle_tickets_ticket_id_fkey`
      FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `notifications` (
    `id` CHAR(36) NOT NULL,
    `order_id` CHAR(36) NULL,
    `ticket_id` CHAR(36) NULL,
    `channel` ENUM('EMAIL', 'SMS') NOT NULL,
    `recipient` VARCHAR(191) NOT NULL,
    `template_key` VARCHAR(100) NOT NULL,
    `status` ENUM('PENDING', 'SENT', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `provider_message_id` VARCHAR(128) NULL,
    `last_error` VARCHAR(255) NULL,
    `payload` JSON NULL,
    `sent_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `notifications_status_channel_idx`(`status`, `channel`),
    INDEX `notifications_order_id_idx`(`order_id`),
    INDEX `notifications_ticket_id_idx`(`ticket_id`),
    PRIMARY KEY (`id`),
    CONSTRAINT `notifications_order_id_fkey`
      FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `notifications_ticket_id_fkey`
      FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `audit_logs` (
    `id` CHAR(36) NOT NULL,
    `actor_user_id` CHAR(36) NULL,
    `action` VARCHAR(100) NOT NULL,
    `entity_type` VARCHAR(64) NOT NULL,
    `entity_id` VARCHAR(128) NOT NULL,
    `ip_address` VARCHAR(64) NULL,
    `user_agent` VARCHAR(255) NULL,
    `payload` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_logs_actor_user_id_created_at_idx`(`actor_user_id`, `created_at`),
    INDEX `audit_logs_entity_type_entity_id_idx`(`entity_type`, `entity_id`),
    PRIMARY KEY (`id`),
    CONSTRAINT `audit_logs_actor_user_id_fkey`
      FOREIGN KEY (`actor_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
