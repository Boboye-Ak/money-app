export default {
  200: {
    responseCode: 200,
    successfulOperation: "Operation Completed Successfully",
  },
  400: {
    responseCode: 400,
    invalidEmail: "Invalid email Address",
    invalidPassword: "Password not complex enough",
    noAuthHeader: "No Authorization Header Present",
    badRequest: "Bad Request",
  },
  401: {
    responseCode: 401,
    invalidAuthHeader: "Invalid Authorization Header",
    invalidUsernameOrPassword: "Invalid Username or password",
    invalidAccessToken:"Invalid or expired Access Token"
  },
  409: {
    responseCode: 409,
    duplicateEmail: "Email Address already in use",
  },
  404: {
    responseCode: 404,
    userNotFound: "User Not Found",
  },
  500: {
    responseCode: 500,
    serverError: "Server Error",
  },
}
