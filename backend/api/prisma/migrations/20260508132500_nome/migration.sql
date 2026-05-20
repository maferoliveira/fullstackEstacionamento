/*
  Warnings:

  - The primary key for the `automovel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `automovel` table. All the data in the column will be lost.
  - You are about to drop the column `placa` on the `estadia` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[placa]` on the table `Automovel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `automovelPlaca` to the `Estadia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `automovel` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    MODIFY `cor` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`placa`);

-- AlterTable
ALTER TABLE `estadia` DROP COLUMN `placa`,
    ADD COLUMN `automovelPlaca` VARCHAR(191) NOT NULL,
    MODIFY `entrada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `Automovel_placa_key` ON `Automovel`(`placa`);

-- AddForeignKey
ALTER TABLE `Estadia` ADD CONSTRAINT `Estadia_automovelPlaca_fkey` FOREIGN KEY (`automovelPlaca`) REFERENCES `Automovel`(`placa`) ON DELETE RESTRICT ON UPDATE CASCADE;
