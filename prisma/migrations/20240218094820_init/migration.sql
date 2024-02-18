/*
  Warnings:

  - A unique constraint covering the columns `[hero]` on the table `HeroRates` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HeroRates_hero_key" ON "HeroRates"("hero");
