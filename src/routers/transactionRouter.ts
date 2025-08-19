import express from "express"
import {
  transaction_get,
  transaction_post,
  transactions_get,
} from "../controlllers/transactionControllers"
import { requireAuth } from "../middleware/userMiddleware"
import { getTransactionsValidator, transferValidator } from "../services/validatorServices"
import { validateRequest } from "../middleware/validateRequest"

const transactionRouter = express.Router()

transactionRouter.get("/", [requireAuth, ...getTransactionsValidator, validateRequest], transactions_get)
transactionRouter.get("/:id", [requireAuth], transaction_get)
transactionRouter.post(
  "/transfer",
  [requireAuth, ...transferValidator, validateRequest],
  transaction_post
)

export default transactionRouter
