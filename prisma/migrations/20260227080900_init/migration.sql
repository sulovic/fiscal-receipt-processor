-- CreateEnum
CREATE TYPE "Countries" AS ENUM ('SRBIJA', 'CRNA_GORA');

-- CreateTable
CREATE TABLE "FiscalReceipt" (
    "id" SERIAL NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "receiptIssueDate" TIMESTAMP(3) NOT NULL,
    "country" "Countries" NOT NULL,
    "nameSurname" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "externalLink" TEXT NOT NULL,
    "dateReceiptCollected" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateSent" TIMESTAMP(3),

    CONSTRAINT "FiscalReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FiscalReceipt_receiptNumber_key" ON "FiscalReceipt"("receiptNumber");

-- CreateIndex
CREATE UNIQUE INDEX "FiscalReceipt_externalLink_key" ON "FiscalReceipt"("externalLink");

-- CreateIndex
CREATE INDEX "FiscalReceipt_receiptNumber_nameSurname_address_idx" ON "FiscalReceipt"("receiptNumber", "nameSurname", "address");
