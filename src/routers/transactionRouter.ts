import express from "express"
import {
  transaction_get,
  transaction_post,
  transactions_get,
} from "../controlllers/transactionControllers"
import { requireAuth } from "../middleware/userMiddleware"

const transactionRouter = express.Router()

transactionRouter.get("/",[requireAuth] ,transactions_get)
transactionRouter.get("/:id",[requireAuth], transaction_get)
transactionRouter.post("/transfer", [requireAuth], transaction_post)

export default transactionRouter
