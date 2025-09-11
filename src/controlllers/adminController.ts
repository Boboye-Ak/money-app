import { Request, Response } from "express"
import {
  adminGetUser,
  adminGetUsers,
  blockUser,
  unblockUser,
} from "../services/adminServices"

export const adminGetUsers_get = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const result = await adminGetUsers(page, limit)
  return res
    .status(result.responseCode)
    .json({ message: result.message, users: result.users })
}

export const adminGetUser_get = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const result = await adminGetUser(id)
  return res
    .status(result.responseCode)
    .json({ message: result.message, user: result.user })
}

export const adminBlockUser_put = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const result = await blockUser(id)
  return res.status(result.responseCode).json({ message: result.message })
}

export const adminUnBlockUser_put = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const result = await unblockUser(id)
  return res.status(result.responseCode).json({ message: result.message })
}
