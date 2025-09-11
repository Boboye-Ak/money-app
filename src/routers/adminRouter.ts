import express from "express"
import { requireAdmin, requireAuth } from "../middleware/userMiddleware"
import {
  adminBlockUser_put,
  adminGetUser_get,
  adminGetUsers_get,
  adminUnBlockUser_put,
} from "../controlllers/adminController"
import {
  adminBlockAndUnblockUserValidator,
  adminGerUserValidator,
  adminGetUsersValidator,
} from "../services/validatorServices"

const adminRouter = express.Router()

adminRouter.get(
  "/users",
  [requireAuth, requireAdmin, ...adminGetUsersValidator],
  adminGetUsers_get
)
adminRouter.get(
  "/users/:id",
  [requireAuth, requireAdmin, ...adminGerUserValidator],
  adminGetUser_get
)
adminRouter.put(
  "users/block/:id",
  [requireAuth, requireAdmin, ...adminBlockAndUnblockUserValidator],
  adminBlockUser_put
)
adminRouter.put(
  "users/unlock/:id",
  [requireAuth, requireAdmin, ...adminBlockAndUnblockUserValidator],
  adminUnBlockUser_put
)

export default adminRouter
