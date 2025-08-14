import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken"
import { MyJwtPayload } from "../types/jwt"

const JWT_ACCESS_SECRET: Secret =
  process.env.JWT_ACCESS_SECRET || "access-secret"
const JWT_REFRESH_SECRET: Secret =
  process.env.JWT_REFRESH_SECRET || "refresh-secret"

const accessOptions: SignOptions = { expiresIn: "15m" }
const refreshOptions: SignOptions = { expiresIn: "7d" }

export function signAccessToken(payload: MyJwtPayload): string {
  return jwt.sign(payload, JWT_ACCESS_SECRET, accessOptions)
}

export function signRefreshToken(payload: MyJwtPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, refreshOptions)
}

export function verifyAccessToken(token: string): JwtPayload | string {
  return jwt.verify(token, JWT_ACCESS_SECRET)
}

export function verifyRefreshToken(token: string): JwtPayload | string {
  return jwt.verify(token, JWT_REFRESH_SECRET)
}
