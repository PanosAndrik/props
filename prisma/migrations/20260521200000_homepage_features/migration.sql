-- AlterTable
ALTER TABLE "PropFirm" ADD COLUMN "instantFunded" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "PropFirm" ADD COLUMN "brandColor" TEXT;
ALTER TABLE "PropFirm" ADD COLUMN "showInOffers" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN "category" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "readTimeMinutes" INTEGER;
ALTER TABLE "BlogPost" ADD COLUMN "difficulty" TEXT;

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "statFirmsValue" TEXT NOT NULL DEFAULT '200+',
    "statFirmsLabel" TEXT NOT NULL DEFAULT 'Prop firms',
    "statTradersValue" TEXT NOT NULL DEFAULT '50,000+',
    "statTradersLabel" TEXT NOT NULL DEFAULT 'Traders helped',
    "statCouponsValue" TEXT NOT NULL DEFAULT 'Exclusive',
    "statCouponsLabel" TEXT NOT NULL DEFAULT 'Coupon codes',
    "statFreeValue" TEXT NOT NULL DEFAULT 'Free',
    "statFreeLabel" TEXT NOT NULL DEFAULT 'Always free',
    "offersTitle" TEXT NOT NULL DEFAULT 'Exclusive Offers',
    "offersSubtitle" TEXT,
    "updatedAt" DATETIME NOT NULL
);

INSERT INTO "SiteSettings" ("id", "updatedAt") VALUES ('default', CURRENT_TIMESTAMP);
