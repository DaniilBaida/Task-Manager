import CustomError from "./customError";

class AuthenticationError extends CustomError<ErrorCode> {}

export default AuthenticationError;
