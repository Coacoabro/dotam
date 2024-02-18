-- CreateTable
CREATE TABLE "HeroRates" (
    "id" SERIAL NOT NULL,
    "hero" TEXT NOT NULL,
    "matches" INTEGER NOT NULL,
    "wins" INTEGER NOT NULL,

    CONSTRAINT "HeroRates_pkey" PRIMARY KEY ("id")
);
