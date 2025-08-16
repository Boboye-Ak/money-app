import express from "express"
import {
  transaction_get,
  transaction_post,
  transactions_get,
} from "../controlllers/transactionControllers"

const transactionRouter = express.Router()

transactionRouter.get("/", transactions_get)
transactionRouter.get("/:id", transaction_get)
transactionRouter.post("/transfer", transaction_post)

export default transactionRouter
