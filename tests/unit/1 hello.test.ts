import { expect } from "chai"
import { hello } from "../../src/services/helloService"

describe("hello service", () => {
  it("should return hello world", () => {
    const result = hello()
    expect(result).to.equal("Hello World")
  })
})
