import express from "express"
import {
  login_post,
  signup_post,
  user_get,
} from "../controlllers/userControllers"
import { requireAuth, validateSignup } from "../middleware/userMiddleware"

const authRouter = express.Router()

authRouter.get("/", [requireAuth], user_get)
authRouter.post("/signup", [validateSignup], signup_post)
authRouter.post("/login", login_post)

export default authRouter
