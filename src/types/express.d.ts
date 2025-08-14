import { JwtPayload } from "jsonwebtoken"
import { MyJwtPayload } from "./jwt"

declare global {
  namespace Express {
    interface Request {
      user?:
        | string
        | JwtPayload
        | MyJwtPayload
    }
  }
}