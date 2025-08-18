import { Request, response, Response } from "express"
import { makeTransfer } from "../services/transactionServices"
import { MyJwtPayload } from "../types/jwt"

export const transactions_get = (req: Request, res: Response) => {}

export const transaction_get = (req: Request, res: Response) => {}

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
    .status(transferResult?.responseCode as number)
    .json({ message: transferResult?.message })
}
