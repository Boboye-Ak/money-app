BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[FullTransactions] (
    [id] INT NOT NULL,
    [tranId] INT NOT NULL,
    [tranAmount] FLOAT(53) NOT NULL,
    [tranDate] DATETIME2 NOT NULL,
    [senderId] INT NOT NULL,
    [SenderName] NVARCHAR(1000) NOT NULL,
    [SenderEmail] NVARCHAR(1000) NOT NULL,
    [ReceiverId] INT NOT NULL,
    [ReceiverName] NVARCHAR(1000) NOT NULL,
    [ReceiverEmail] NVARCHAR(1000) NOT NULL,
    [Narration] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [FullTransactions_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
