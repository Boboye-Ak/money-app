import { Request, Response, NextFunction } from "express"
import { verifyAccessToken } from "../services/jwtServices"
import {
  extractAuthorizationToken,
  isPasswordComplex,
} from "../services/userServices"
import { isEmail } from "validator"
import responses from "../configs/responses"

export const validateSignup = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, firstName, lastName, password } = req.body
    if (!isEmail(email)) {
      return res
        .status(responses[400].responseCode)
        .json({ error: responses[400].invalidEmail })
    }
    if (!isPasswordComplex(password)) {
      return res
        .status(responses[400].responseCode)
        .json({ error: responses[400].invalidPassword })
    }
    next()
  } catch (e) {
    return res
      .status(responses[500].responseCode)
      .json({ message: responses[500].serverError })
  }
}

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
    const payload = verifyAccessToken(token)
    req.user = payload
    next()
  } catch (e) {
    console.log(e)
    return res
      .status(responses[500].responseCode)
      .json({ error: responses[500].serverError })
  }
}
