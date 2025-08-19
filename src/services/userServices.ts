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
    return AppError.handleAppError(e, "Error Signing Up")
  }
}

export const getUserById = async (
  userId: number
): Promise<{ responseCode: number; message: string; user?: any }> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { flags: true },
    })
    if (!user) throw new AppError("User Not Found", 404)
    const { hashedPassword, ...safeUser } = user
    return {
      responseCode: 200,
      message: "Operation Completed Successfully",
      user: safeUser,
    }
  } catch (e) {
    return AppError.handleAppError(e, "Error Getting User")
  }
}

export const login = async (
  email: string,
  password: string
): Promise<{
  responseCode: number
  message: string
  tokens?: { accessToken: string; refreshToken: string }
}> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { flags: true },
    })
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
    return AppError.handleAppError(e, "Error Signing Up")
  }
}

export const refreshAccessToken = async (
  refreshToken: string
): Promise<{ responseCode: number; message: string; accessToken?: string }> => {
  try {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    })
    if (!storedToken) throw new AppError("Invalid refresh token", 401)
    const user = await prisma.user.findUnique({
      where: { id: storedToken?.userId },
      include: { flags: true },
    })
    if (!user) throw new AppError("User not found", 404)
    await verifyRefreshToken(refreshToken)
    const accessToken = signAccessToken({
      userId: storedToken.userId,
      email: user.email,
    })
    return {
      responseCode: 200,
      message: "Operation Completed Successfully",
      accessToken,
    }
  } catch (e) {
    return AppError.handleAppError(e, "Error Refreshing Token")
  }
}

export const logout = async (refreshToken: string) => {
  try {
    await prisma.refreshToken.delete({ where: { token: refreshToken } })
    return { message: "Operation Completed Successfully", responseCode: 200 }
  } catch (e) {
    return AppError.handleAppError(e, "Error Logging out")
  }
}
