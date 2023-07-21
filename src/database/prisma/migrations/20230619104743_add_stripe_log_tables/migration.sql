-- CreateTable
CREATE TABLE "StripeLogs" (
    "id" BIGINT NOT NULL,
    "customerId" VARCHAR(50),
    "event" VARCHAR(150),
    "json" TEXT,
    "is_active_user" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeLogs_pkey" PRIMARY KEY ("id")
);
