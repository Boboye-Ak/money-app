import { Request, Response, NextFunction } from "express"
import { verifyAccessToken } from "../services/jwtServices"
import { extractAuthorizationToken } from "../services/validatorServices"
import responses from "../configs/responses"

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
