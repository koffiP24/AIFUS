-- CreateTable
CREATE TABLE `EventSetting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `location` VARCHAR(191) NULL,
    `startsAt` DATETIME(3) NULL,
    `endsAt` DATETIME(3) NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `EventSetting_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- SeedData
INSERT INTO `EventSetting` (`key`, `title`, `subtitle`, `description`, `location`, `startsAt`, `endsAt`, `isPublished`, `createdAt`, `updatedAt`)
VALUES
    (
        'village',
        'Village Opportunites Ivoiro-Russe',
        'Evenement gratuit',
        'Plateforme d''information, d''orientation et de cooperation entre la Cote d''Ivoire et la Russie.',
        'Abidjan',
        '2026-07-31 09:00:00.000',
        '2026-07-31 18:00:00.000',
        true,
        CURRENT_TIMESTAMP(3),
        CURRENT_TIMESTAMP(3)
    ),
    (
        'gala',
        'Gala des Alumni',
        'Soiree de prestige',
        'Grande soiree de celebration, de reconnaissance et de reseautage intergenerationnel.',
        'Hotel Palm Club / Sofitel',
        '2026-08-01 18:00:00.000',
        '2026-08-02 02:00:00.000',
        true,
        CURRENT_TIMESTAMP(3),
        CURRENT_TIMESTAMP(3)
    ),
    (
        'tombola',
        'Grande Tombola AIFUS',
        'Tirage lors du gala',
        'Tombola officielle des festivites AIFUS 2026 avec tirage pendant la soiree du gala.',
        'Scene principale du gala',
        '2026-08-01 21:30:00.000',
        '2026-08-01 22:00:00.000',
        true,
        CURRENT_TIMESTAMP(3),
        CURRENT_TIMESTAMP(3)
    );
