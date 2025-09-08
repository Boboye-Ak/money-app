import prisma from "../configs/prisma"
import { AppError } from "../types/error"
export const adminGetUsers = async (page: number, limit: number) => {
  try {
    const skip = (page - 1) * limit
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        balance: true,
        createdAt: true,
      },
    })

    return {
      message: "Operation Completed Successfully",
      responseCode: 200,
      users,
    }
  } catch (e) {
    return AppError.handleAppError(e, "Error Getting Users")
  }
}

export const adminGetUser = async (userId: number) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        balance: true,
        createdAt: true,
      },
    })
    if (!user) throw new AppError("User not found", 404)
    return { message: "Operation Completed Successfully", user }
  } catch (e) {
    return AppError.handleAppError(e, "Error Getting User")
  }
}

export const blockUser = async (userId: number) => {
  try {
    const user = await prisma.flags.update({
      where: {
        customerId: userId,
      },
      data: {
        isBlocked: true,
      },
    })
    return { message: "Operation Completed Successfully", responseCode: 200 }
  } catch (e) {
    return AppError.handleAppError(e, "Error Blocking User")
  }
}

export const unblockUser = async (userId: number) => {
  try {
    const user = await prisma.flags.update({
      where: {
        customerId: userId,
      },
      data: {
        isBlocked: false,
      },
    })
    return { message: "Operation Completed Successfully", responseCode: 200 }
  } catch (e) {
    return AppError.handleAppError(e, "Error Unblocking User")
  }
}
