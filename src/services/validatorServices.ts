import { body } from "express-validator"

export const extractAuthorizationToken = (
  authHeader: string
): string | null => {
  const headerArray = authHeader.split(" ")
  if (headerArray.length !== 2 && headerArray[0] !== "Bearer") {
    return null
  } else {
    return headerArray[1]
  }
}

export const isPasswordComplex = (password: string): boolean => {
  if (password.length < 8) return false // Minimum 8 characters
  const hasNumber = /\d/.test(password) // At least one number
  const hasUppercase = /[A-Z]/.test(password) // At least one uppercase letter
  const hasLowercase = /[a-z]/.test(password) // At least one lowercase letter
  const hasSymbol = /[^A-Za-z0-9]/.test(password) // At least one symbol (non-alphanumeric)
  return hasNumber && hasUppercase && hasLowercase && hasSymbol
}

export const signUpValidator = [
  body("email").isEmail().withMessage("Invalid Email Address"),
  body("password")
    .isString()
    .custom((password) => {
      if (password.length < 8) throw new Error("Password too short") // Minimum 8 characters
      const hasNumber = /\d/.test(password) // At least one number
      const hasUppercase = /[A-Z]/.test(password) // At least one uppercase letter
      const hasLowercase = /[a-z]/.test(password) // At least one lowercase letter
      const hasSymbol = /[^A-Za-z0-9]/.test(password) // At least one symbol (non-alphanumeric)
      return hasNumber && hasUppercase && hasLowercase && hasSymbol
    }),
  body("firstName").isString(),
  body("lastName").isString(),
]

export const loginValidator = [
  body("email").isEmail().withMessage("Invalid Email Address"),
]

export const refreshTokenValidator = [
  body("refreshToken").isString().withMessage("Enter refresh token"),
]
