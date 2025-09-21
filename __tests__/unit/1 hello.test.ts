import { hello } from "../../src/services/helloService"

describe("hello service", () => {
  it("should return hello world", () => {
    const result = hello()
    expect(result).toBe("Hello World")
  })
})
