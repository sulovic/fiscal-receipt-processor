/*
  Warnings:

  - Added the required column `shipmentNumber` to the `FiscalReceipt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FiscalReceipt" ADD COLUMN     "shipmentNumber" TEXT NOT NULL;
