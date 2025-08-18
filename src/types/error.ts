// src/errors/AppError.ts
export class AppError extends Error {
    responseCode: number
  
    constructor(message: string, responseCode: number) {
      super(message)
      this.responseCode = responseCode
  
      // Restore prototype chain (important in TS/Node for instanceof to work)
      Object.setPrototypeOf(this, new.target.prototype)
    }
  }
  