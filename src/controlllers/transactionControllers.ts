import { Request, response, Response } from "express"
import {
  getTransaction,
  getTransactions,
  makeTransfer,
} from "../services/transactionServices"
import { MyJwtPayload } from "../types/jwt"

export const transactions_get = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const { userId } = req.user as MyJwtPayload
  const result = await getTransactions(userId, page, limit)
  return res.status(result?.responseCode).json({
    message: result?.message,
    transactions: result?.transactions,
    count: result.count,
  })
}

export const transaction_get = async (req: Request, res: Response) => {
  const tranId = req.params.id
  const { userId } = req.user as MyJwtPayload
  const result = await getTransaction(userId, tranId)
  return res
    .status(result.responseCode)
    .json({ message: result.message, transaction: result.transaction })
}

export const transaction_post = async (req: Request, res: Response) => {
  const { email: senderEmail } = req.user as MyJwtPayload
  const { receiverEmail, amount, narration } = req.body
  const transferResult = await makeTransfer(
    senderEmail.toLowerCase(),
    receiverEmail.toLowerCase(),
    amount.toFixed(2),
    narration
  )
  return res
    .status(transferResult?.responseCode)
    .json({ message: transferResult?.message })
}
