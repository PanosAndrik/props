-- CreateTable
CREATE TABLE "FirmChallenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firmId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "accountSize" TEXT,
    "price" REAL,
    "profitTarget" TEXT,
    "maxDrawdown" TEXT,
    "profitSplit" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FirmChallenge_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "PropFirm" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "FirmChallenge_firmId_published_idx" ON "FirmChallenge"("firmId", "published");
