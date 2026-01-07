-- CreateTable
CREATE TABLE "ChatSession" (
    "id" TEXT NOT NULL,
    "userA" TEXT NOT NULL,
    "userB" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);
