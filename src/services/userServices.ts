import bcrypt from "bcrypt"
import prisma from "../configs/prisma"
import { User } from "../generated/prisma"
import { signAccessToken, signRefreshToken } from "./jwtServices"
import { errorMessages } from "../configs/errorMessages"
import ms, { StringValue } from "ms"

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

export const registerUser = async (
  email: string,
  firstName: string,
  lastName: string,
  password: string
) => {
  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(password, salt)
  return await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      firstname: firstName.toUpperCase(),
      lastname: lastName.toUpperCase(),
      hashedPassword,
    },
  })
}

export const getUserById = async (userId: number): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })
  return user
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })
  return user
}

export const login = async (email: string, password: string) => {
  const user = await getUserByEmail(email)
  if (!user) throw new Error(errorMessages.invalidCredentials)
  const match = await bcrypt.compare(password, user.hashedPassword)
  if (!match) throw new Error(errorMessages.invalidCredentials)
  const accessToken = await signAccessToken({
    userId: user.id,
    email: user.email,
  })
  const refreshToken = await signRefreshToken({
    userId: user.id,
    email: user.email,
  })
  const refreshTokenExpiresIn = process.env
    .REFRESH_TOKEN_EXPIRES_IN as StringValue
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + ms(refreshTokenExpiresIn)),
    },
  })

  return { accessToken, refreshToken }
}
