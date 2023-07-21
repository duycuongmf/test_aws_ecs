-- CreateTable
CREATE TABLE "UsedServices" (
    "id" BIGINT NOT NULL,
    "quantity" INTEGER DEFAULT 0,
    "module" VARCHAR(50),
    "action" VARCHAR(50),
    "creatorId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsedServices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UsedServices" ADD CONSTRAINT "UsedServices_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
