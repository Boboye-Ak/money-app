/*
  Warnings:

  - You are about to drop the column `isVerified` on the `User` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[User] DROP COLUMN [isVerified];

-- CreateTable
CREATE TABLE [dbo].[Flags] (
    [customerId] INT NOT NULL,
    [isAdmin] BIT NOT NULL,
    [isBlocked] BIT NOT NULL,
    [isActive] BIT NOT NULL,
    [isVerified] BIT NOT NULL,
    CONSTRAINT [Flags_pkey] PRIMARY KEY CLUSTERED ([customerId]),
    CONSTRAINT [Flags_customerId_key] UNIQUE NONCLUSTERED ([customerId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Flags] ADD CONSTRAINT [Flags_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
