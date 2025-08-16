import responses from "../configs/responses"
import { Prisma } from "../generated/prisma"
export const duplicateRecordCheck = (e: unknown) => {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
    return { isDuplicateRecord: true, field: e.meta?.target }
  } else {
    return { isDuplicateRecord: false, field: null }
  }
}

export const handleSignupError = (e: unknown) => {
  console.log(e)
  if (duplicateRecordCheck(e).isDuplicateRecord) {
    return {
      code: responses[409].responseCode,
      message: responses[409].duplicateEmail,
    }
  } else {
    return {
      code: responses[500].responseCode,
      message: responses[500].serverError,
    }
  }
}

export const handleLoginError = (e: unknown) => {
  console.log(e)
  if (e instanceof Error) {
    console.error("Error message:", e.message)
    return { code: responses[401].responseCode, message: e.message }
  } else {
    return {
      code: responses[500].responseCode,
      message: responses[500].serverError,
    }
  }
}
