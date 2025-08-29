import CustomError from "@/shared/errors/customError";
import { ErrorCode } from "./types";

class AuthenticationError extends CustomError<ErrorCode> {}

export default AuthenticationError;
