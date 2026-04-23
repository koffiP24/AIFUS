-- AlterTable
ALTER TABLE `InscriptionGala`
    ADD COLUMN `ticketCode` VARCHAR(191) NULL,
    ADD COLUMN `qrToken` VARCHAR(191) NULL,
    ADD COLUMN `checkedInAt` DATETIME(3) NULL,
    ADD COLUMN `checkedInById` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `InscriptionGala_ticketCode_key` ON `InscriptionGala`(`ticketCode`);

-- CreateIndex
CREATE UNIQUE INDEX `InscriptionGala_qrToken_key` ON `InscriptionGala`(`qrToken`);

-- CreateIndex
CREATE INDEX `InscriptionGala_checkedInAt_idx` ON `InscriptionGala`(`checkedInAt`);

-- CreateIndex
CREATE INDEX `InscriptionGala_checkedInById_idx` ON `InscriptionGala`(`checkedInById`);

-- AddForeignKey
ALTER TABLE `InscriptionGala`
    ADD CONSTRAINT `InscriptionGala_checkedInById_fkey`
    FOREIGN KEY (`checkedInById`) REFERENCES `User`(`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE;
