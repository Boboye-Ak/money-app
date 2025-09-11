import { Request, Response, NextFunction } from "express"
import { verifyAccessToken } from "../services/jwtServices"
import { extractAuthorizationToken } from "../services/validatorServices"
import responses from "../configs/responses"
import { MyJwtPayload } from "../types/jwt"
import prisma from "../configs/prisma"

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader: string | undefined = req.headers.authorization
    if (!authorizationHeader) {
      return res
        .status(responses[400].responseCode)
        .json({ error: responses[400].noAuthHeader })
    }
    const token: string | null = extractAuthorizationToken(authorizationHeader)
    if (!token) {
      return res
        .status(responses[401].responseCode)
        .json({ error: responses[401].invalidAuthHeader })
    }
    try {
      const payload = verifyAccessToken(token)
      req.user = payload
    } catch (e) {
      console.log(e)
      return res
        .status(responses[401].responseCode)
        .json({ message: responses[401].invalidAccessToken })
    }

    next()
  } catch (e) {
    console.log(e)
    return res
      .status(responses[500].responseCode)
      .json({ error: responses[500].serverError })
  }
}

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.user as MyJwtPayload
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { flags: true },
  })
  if (!user) {
    return res.status(404).json({ message: "User Not found" })
  }
  if (!user.flags?.isAdmin) {
    return res
      .status(401)
      .json({ message: "Admin Access is required to access this endpoint" })
  }
  next()
}
