/*
  Warnings:

  - You are about to drop the column `batteryBonus` on the `Equipment` table. All the data in the column will be lost.
  - You are about to drop the column `batteryCost` on the `Equipment` table. All the data in the column will be lost.
  - Added the required column `battery` to the `Equipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bulletRange` to the `Equipment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Equipment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playerId" INTEGER NOT NULL,
    "shipId" INTEGER NOT NULL,
    "sprite" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "bulletDamage" INTEGER NOT NULL,
    "bulletRange" INTEGER NOT NULL,
    "bulletSpeed" INTEGER NOT NULL,
    "shootDelay" INTEGER NOT NULL,
    "shieldBonus" INTEGER NOT NULL,
    "healthBonus" INTEGER NOT NULL,
    "battery" INTEGER NOT NULL,
    CONSTRAINT "Equipment_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Equipment_shipId_fkey" FOREIGN KEY ("shipId") REFERENCES "Ship" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Equipment" ("bulletDamage", "bulletSpeed", "healthBonus", "id", "level", "playerId", "shieldBonus", "shipId", "shootDelay", "sprite", "type") SELECT "bulletDamage", "bulletSpeed", "healthBonus", "id", "level", "playerId", "shieldBonus", "shipId", "shootDelay", "sprite", "type" FROM "Equipment";
DROP TABLE "Equipment";
ALTER TABLE "new_Equipment" RENAME TO "Equipment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
