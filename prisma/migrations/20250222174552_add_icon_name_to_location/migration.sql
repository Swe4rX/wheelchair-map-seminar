ALTER TABLE "Location" ADD COLUMN "icon" TEXT NOT NULL DEFAULT 'default-icon';

-- Update existing rows to have a specific default value
UPDATE "Location" SET "icon" = 'default-icon' WHERE "icon" IS NULL;

-- Remove the default value constraint
ALTER TABLE "Location" ALTER COLUMN "icon" DROP DEFAULT;