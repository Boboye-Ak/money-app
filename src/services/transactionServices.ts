import prisma from "../configs/prisma"
import { v4 as uuidv4 } from "uuid"
import { AppError } from "../types/error"

export const getTransactions = async (
  userId: number,
  page: number,
  limit: number
): Promise<{ responseCode: number; message: string; transactions?: any[], count?:number }> => {
  try {
    const skip = (page - 1) * limit
    const transactions = await prisma.fullTransaction.findMany({
      skip: skip,
      take: limit,
      where: { OR: [{ senderId: userId }, { ReceiverId: userId }] },
    })
    return { responseCode: 200, message: "Operation Successful", transactions, count:transactions.length }
  } catch (e) {
    return AppError.handleAppError(e, "Error Getting Transaction")
  }
}

export const getTransaction = async (tranId: number) => {}

export const makeTransfer = async (
  senderEmail: string,
  receiverEmail: string,
  amount: number,
  narration: string
) => {
  try {
    await prisma.$transaction(async (tx) => {
      const tranId = uuidv4()
      // 1. Lock sender row
      const sender = await tx.$queryRawUnsafe<any>(
        `SELECT * FROM [User] WITH (UPDLOCK, ROWLOCK) WHERE email = @p1`,
        senderEmail
      )

      if (!sender.length) throw new AppError("Sender not found", 404)
      const senderFlags = await tx.flags.findFirst({
        where: { customerId: sender[0].id },
      })
      if (sender[0].balance < amount)
        throw new AppError("Insufficient funds", 400)
      if (senderFlags?.isBlocked) throw new Error("Sender is blocked")
      if (!senderFlags?.isActive) throw new Error("Sender is inactive")

      // 2. Lock receiver row
      const receiver = await tx.$queryRawUnsafe<any>(
        `SELECT * FROM [User] WITH (UPDLOCK, ROWLOCK) WHERE email = @p1`,
        receiverEmail
      )
      if (!receiver.length) throw new AppError("Receiver not found", 404)
      const receiverFlags = await tx.flags.findFirst({
        where: { customerId: receiver[0].id },
      })
      if (receiverFlags?.isBlocked)
        throw new AppError("Receiver is blocked", 401)
      if (!receiverFlags?.isActive)
        throw new AppError("Receiver is inactive", 401)

      // 3. Update balances
      await tx.user.update({
        where: { id: sender[0].id },
        data: { balance: { decrement: amount } },
      })

      await tx.user.update({
        where: { id: receiver[0].id },
        data: { balance: { increment: amount } },
      })

      // 4. Insert debit leg
      await tx.transaction.create({
        data: {
          tranId,
          amount,
          part_tran_type: "D",
          customerId: sender[0].id,
          customerFirstName: sender[0].firstname,
          customerLastName: sender[0].lastname,
          customerEmail: sender[0].email,
          narration: narration,
        },
      })

      // 5. Insert credit leg
      await tx.transaction.create({
        data: {
          tranId,
          amount,
          part_tran_type: "C",
          customerId: receiver[0].id,
          customerFirstName: receiver[0].firstname,
          customerLastName: receiver[0].lastname,
          customerEmail: receiver[0].email,
          narration: narration,
        },
      })
    })
    return { message: "Transfer successful", responseCode: 200 }
  } catch (e: any) {
    console.error(e)
    if (e instanceof AppError)
      return {
        message: e.message || "Transfer failed",
        responseCode: e.responseCode,
      }
    else return { message: e.message || "Transfer failed", responseCode: 500 }
  }
}
