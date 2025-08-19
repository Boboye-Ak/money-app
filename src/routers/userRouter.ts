import express from "express"
import {
  login_post,
  logout_post,
  refreshToken_post,
  signup_post,
  user_get,
} from "../controlllers/userControllers"
import { requireAuth} from "../middleware/userMiddleware"
import {
  loginValidator,
  refreshTokenValidator,
  signUpValidator,
} from "../services/validatorServices"
import { validateRequest } from "../middleware/validateRequest"

const authRouter = express.Router()

authRouter.get("/", [requireAuth], user_get)
authRouter.post("/signup", [...signUpValidator, validateRequest], signup_post)
authRouter.post("/login", [...loginValidator, validateRequest], login_post)
authRouter.post(
  "/refresh",
  [...refreshTokenValidator, validateRequest],
  refreshToken_post
)
authRouter.post(
  "/logout",
  [...refreshTokenValidator, requireAuth, validateRequest],
  logout_post
)

export default authRouter
