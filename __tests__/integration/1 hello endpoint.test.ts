import request from "supertest"
import app from "../../src/app"

describe("/", () => {
  it("Should return message Hello world with status code 200", async () => {
    const res = await request(app).get("/")
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ message: "Hello World!" })
  })
})
