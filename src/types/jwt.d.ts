// src/types/jwt.d.ts
import { JwtPayload } from "jsonwebtoken"

export interface MyJwtPayload extends JwtPayload {
  userId: number
  email: string
}