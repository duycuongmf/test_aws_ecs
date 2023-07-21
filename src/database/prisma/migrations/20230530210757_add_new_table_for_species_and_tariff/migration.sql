-- CreateTable
CREATE TABLE "SpeciesTariff" (
    "speciesId" BIGINT NOT NULL,
    "tariffId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpeciesTariff_pkey" PRIMARY KEY ("speciesId","tariffId")
);

-- AddForeignKey
ALTER TABLE "SpeciesTariff" ADD CONSTRAINT "SpeciesTariff_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeciesTariff" ADD CONSTRAINT "SpeciesTariff_tariffId_fkey" FOREIGN KEY ("tariffId") REFERENCES "Tariffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
