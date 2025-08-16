BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Flags] ADD CONSTRAINT [Flags_isActive_df] DEFAULT 1 FOR [isActive], CONSTRAINT [Flags_isAdmin_df] DEFAULT 0 FOR [isAdmin], CONSTRAINT [Flags_isBlocked_df] DEFAULT 0 FOR [isBlocked], CONSTRAINT [Flags_isVerified_df] DEFAULT 1 FOR [isVerified];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
