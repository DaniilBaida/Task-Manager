import CustomError from "@/shared/errors/customError";
import { ErrorCode } from "./types";

class AuthenticationError extends CustomError<ErrorCode> {
    static unauthorized(message = "Unauthorized"): AuthenticationError {
        return new AuthenticationError({
            message,
            statusCode: 401,
            code: "ERR_AUTH",
        });
    }

    static forbidden(message = "Forbidden"): AuthenticationError {
        return new AuthenticationError({
            message,
            statusCode: 403,
            code: "ERR_AUTH",
        });
    }
}

export default AuthenticationError;
