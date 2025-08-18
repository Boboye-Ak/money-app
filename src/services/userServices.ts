import bcrypt from "bcrypt"
import prisma from "../configs/prisma"
import { User } from "../generated/prisma"
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "./jwtServices"
import { errorMessages } from "../configs/errorMessages"
import ms, { StringValue } from "ms"
import jwt from "jsonwebtoken"
import { AppError } from "../types/error"

export const registerUser = async (
  email: string,
  firstName: string,
  lastName: string,
  password: string
) => {
  try {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })
    if (existingUser) throw new AppError("User Already Exists", 409)
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        firstname: firstName.toUpperCase(),
        lastname: lastName.toUpperCase(),
        hashedPassword,
        flags: {
          create: {},
        },
      },
      include: {
        flags: true,
      },
    })
    return { message: "Operation Completed Successfully", responseCode: 200 }
  } catch (e) {
    console.log(e)
    if (e instanceof AppError) {
      return {
        message: e.message || "Error Creating User",
        responseCode: e.responseCode,
      }
    }
    return { message: "Unknown error", responseCode: 500 }
  }
}

export const getUserById = async (userId: number): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { flags: true },
  })
  return user
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { flags: true },
  })
  return user
}

export const login = async (email: string, password: string) => {
  try {
    if (!email || !password) throw new AppError("Invalid Credentials", 401)
    const user = await getUserByEmail(email)
    if (!user) throw new AppError("Invalid Credentials", 401)
    const match = await bcrypt.compare(password, user.hashedPassword)
    if (!match) throw new AppError("Invalid Credentials", 401)
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

    return {
      responseCode: 200,
      message: "Operation Completed Successfully",
      tokens: { accessToken, refreshToken },
    }
  } catch (e) {
    console.log(e)
    if (e instanceof AppError) {
      return {
        message: e.message || "Error Logging in",
        responseCode: e.responseCode,
      }
    }
    return { message: "Unknown error", responseCode: 500 }
  }
}

export const refreshAccessToken = async (refreshToken: string) => {
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  })
  if (!storedToken) throw new Error("Invalid refresh token")
  const user = await prisma.user.findUnique({
    where: { id: storedToken?.userId },
  })
  if (!user) throw new Error("User not found")
  await verifyRefreshToken(refreshToken)
  const newAccessToken = signAccessToken({
    userId: storedToken.userId,
    email: user.email,
  })
  return newAccessToken
}

export const logout = async (refreshToken: string) => {
  await prisma.refreshToken.delete({ where: { token: refreshToken } })
}
