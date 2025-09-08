import express from "express"

const adminRouter = express.Router()

adminRouter.get("/users")
adminRouter.get("/users/:id",)
adminRouter.put("users/block/:id")
adminRouter.put("users/unlock/:id")

export default adminRouter
