-- CreateTable
CREATE TABLE "ProfileConfiguration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "colorTheme" TEXT NOT NULL DEFAULT 'slate',
    "askConfirmation" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    CONSTRAINT "ProfileConfiguration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileConfiguration_userId_key" ON "ProfileConfiguration"("userId");
