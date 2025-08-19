import { Prisma } from "../generated/prisma"
import { Request, Response } from "express"
import {
  getUserById,
  login,
  logout,
  refreshAccessToken,
  registerUser,
} from "../services/userServices"
import responses from "../configs/responses"
import {
  duplicateRecordCheck,
  handleLoginError,
  handleSignupError,
} from "../services/errorHandler"
import { MyJwtPayload } from "../types/jwt"

export const signup_post = async (req: Request, res: Response) => {
  const { email, firstName, lastName, password } = req?.body
  const result = await registerUser(email, firstName, lastName, password)
  return res.status(result.responseCode).json({ message: result.message })
}

export const login_post = async (req: Request, res: Response) => {
  const { email, password } = req?.body
  const result = await login(email, password)
  return res
    .status(result.responseCode)
    .json({ message: result.message, tokens: result.tokens })
}

export const user_get = async (req: Request, res: Response) => {
  const { email: senderEmail, userId } = req.user as MyJwtPayload
  const result = await getUserById(userId)
  return res
    .status(result.responseCode)
    .json({ message: result.message, data: result?.user })
}

export const refreshToken_post = async (req: Request, res: Response) => {
  const { refreshToken } = req?.body
  const result = await refreshAccessToken(refreshToken)
  return res
    .status(result.responseCode)
    .json({ message: result.message, accessToken: result.accessToken })
}

export const logout_post = async (req: Request, res: Response) => {
  const { refreshToken } = req?.body
  const result = await logout(refreshToken)
  return res.status(result?.responseCode).json({ message: result?.message })
}
