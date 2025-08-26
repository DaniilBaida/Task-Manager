import CustomError from "@/errors/customError";

class AuthenticationError extends CustomError<ErrorCode> {}

export default AuthenticationError;
