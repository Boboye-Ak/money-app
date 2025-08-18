// src/errors/AppError.ts
export class AppError extends Error {
    responseCode: number
  
    constructor(message: string, responseCode: number) {
      super(message)
      this.responseCode = responseCode
  
      // Restore prototype chain (important in TS/Node for instanceof to work)
      Object.setPrototypeOf(this, new.target.prototype)
    }
      // Static method to handle errors consistently
  static handleAppError(e: unknown, defaultMessage: string) {
    console.log(e)

    if (e instanceof AppError) {
      return {
        message: e.message || defaultMessage,
        responseCode: e.responseCode,
      }
    }

    return {
      message: defaultMessage || "Unknown error",
      responseCode: 500,
    }
  }
  }
  