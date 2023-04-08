/*
  Warnings:

  - Added the required column `level` to the `Ship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `Equipment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ship" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playerId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "baseHP" INTEGER NOT NULL,
    "bulletRange" INTEGER NOT NULL,
    "bulletSpeed" INTEGER NOT NULL,
    "bulletDamage" INTEGER NOT NULL,
    "shootDelay" INTEGER NOT NULL,
    "shield" INTEGER NOT NULL,
    "battery" INTEGER NOT NULL,
    "sprite" TEXT NOT NULL,
    "isCurrent" BOOLEAN NOT NULL,
    "weaponSlots" INTEGER NOT NULL,
    "defenseSlots" INTEGER NOT NULL,
    "batterySlots" INTEGER NOT NULL,
    CONSTRAINT "Ship_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ship" ("baseHP", "battery", "batterySlots", "bulletDamage", "bulletRange", "bulletSpeed", "defenseSlots", "id", "isCurrent", "playerId", "shield", "shootDelay", "sprite", "weaponSlots") SELECT "baseHP", "battery", "batterySlots", "bulletDamage", "bulletRange", "bulletSpeed", "defenseSlots", "id", "isCurrent", "playerId", "shield", "shootDelay", "sprite", "weaponSlots" FROM "Ship";
DROP TABLE "Ship";
ALTER TABLE "new_Ship" RENAME TO "Ship";
CREATE TABLE "new_Equipment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playerId" INTEGER NOT NULL,
    "shipId" INTEGER NOT NULL,
    "sprite" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "stats" TEXT NOT NULL,
    "battery" INTEGER NOT NULL,
    CONSTRAINT "Equipment_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Equipment_shipId_fkey" FOREIGN KEY ("shipId") REFERENCES "Ship" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Equipment" ("battery", "id", "playerId", "shipId", "sprite", "stats", "type") SELECT "battery", "id", "playerId", "shipId", "sprite", "stats", "type" FROM "Equipment";
DROP TABLE "Equipment";
ALTER TABLE "new_Equipment" RENAME TO "Equipment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
