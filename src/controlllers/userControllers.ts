import { Prisma } from "../generated/prisma"
import { Request, Response } from "express"
import {
  getUserByEmail,
  getUserById,
  login,
  refreshAccessToken,
  registerUser,
} from "../services/userServices"
import responses from "../configs/responses"
import {
  duplicateRecordCheck,
  handleLoginError,
  handleSignupError,
} from "../services/errorHandler"

export const signup_post = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, password } = req?.body
    const user = await registerUser(email, firstName, lastName, password)
    return res
      .status(responses[200].responseCode)
      .json({ message: responses[200].successfulOperation })
  } catch (e) {
    console.log(e)
    const response = handleSignupError(e)
    return res.status(response.code).json({ message: response.message })
  }
}

export const login_post = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const tokens = await login(email, password)
    return res
      .status(responses[200].responseCode)
      .json({ message: responses[200].successfulOperation, ...tokens })
  } catch (e) {
    const response = handleLoginError(e)
    return res.status(response.code).json({ message: response.message })
  }
}

export const user_get = async (req: Request, res: Response) => {
  try {
    if (req.user && typeof req.user !== "string" && "userId" in req.user) {
      const { userId } = req.user
      const user = await getUserById(userId)
      if (!user) {
        return res
          .status(responses[404].responseCode)
          .json({ message: responses[404].userNotFound })
      }
      const { hashedPassword, ...safeUser } = user
      return res
        .status(responses[200].responseCode)
        .json({ message: responses[200].successfulOperation, data: safeUser })
    }
  } catch (e) {
    return res
      .status(responses[500].responseCode)
      .json({ message: responses[500].serverError })
  }
}

export const refreshToken_post = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body
    const accessToken = await refreshAccessToken(refreshToken)
    return res.status(responses[200].responseCode).json({
      message: responses[200].successfulOperation,
    accessToken,
    })
  } catch (e) {
    console.log(e)
    res.status(401).json({ error: (e as Error).message })
  }
}

export const logout_post = async (req: Request, res: Response) => {}
