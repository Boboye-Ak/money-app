import express, { Request, Response } from "express"
import initialize from "./loaders/initialize"
initialize()
import environmentVariables from "./configs/environmentVariables"
import authRouter from "./routers/userRouter"
import transactionRouter from "./routers/transactionRouter"
import adminRouter from "./routers/adminRouter"

const app = express()

app.use(express.json())

//Routers
app.use("/api/user", authRouter)
app.use("/api/transactions", transactionRouter)
app.use("/api/admin", adminRouter)

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!")
})

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" })
})

app.listen(environmentVariables.port, () => {
  console.log(`Server is listening on port ${environmentVariables.port}`)
})

export default app
