/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `Purchase` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deliveryFee` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentDetails` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerUnit` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tax` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `purchase` ADD COLUMN `deliveryFee` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `orderId` VARCHAR(191) NOT NULL,
    ADD COLUMN `paymentDetails` JSON NOT NULL,
    ADD COLUMN `paymentMethod` VARCHAR(191) NOT NULL,
    ADD COLUMN `pricePerUnit` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    ADD COLUMN `tax` DECIMAL(10, 2) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Purchase_orderId_key` ON `Purchase`(`orderId`);

-- CreateIndex
CREATE INDEX `Purchase_orderId_idx` ON `Purchase`(`orderId`);
