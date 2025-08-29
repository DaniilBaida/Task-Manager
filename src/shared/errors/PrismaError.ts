import { Prisma } from "@prisma/client";
import CustomError from "@/shared/errors/customError";
import { ErrorCode } from "./types";

class PrismaError extends CustomError<ErrorCode> {
    constructor(error: Prisma.PrismaClientKnownRequestError) {
        const errorMap = {
            P2025: {
                message: `Resource not found`,
                statusCode: 404,
                code: "ERR_NF" as ErrorCode,
            },
            P2002: {
                message: "A resource with this value already exists",
                statusCode: 409,
                code: "ERR_DUPLICATE" as ErrorCode,
            },
            P2003: {
                message:
                    "Invalid reference - the specified resource does not exist",
                statusCode: 400,
                code: "ERR_FK" as ErrorCode,
            },
            P2004: {
                message: "Operation violates a database constraint",
                statusCode: 400,
                code: "ERR_CONSTRAINT" as ErrorCode,
            },
            P2014: {
                message:
                    "The change you are trying to make would violate the required relation",
                statusCode: 400,
                code: "ERR_REQUIRED_RELATION" as ErrorCode,
            },
            P2016: {
                message: "Invalid operation - unable to process the request",
                statusCode: 400,
                code: "ERR_INVALID_OP" as ErrorCode,
            },
        };
        const errorInfo = errorMap[error.code as keyof typeof errorMap] || {
            message: "Database operation failed",
            statusCode: 500,
            code: "ERR_DB" as ErrorCode,
        };

        super({
            message: errorInfo.message,
            statusCode: errorInfo.statusCode,
            code: errorInfo.code,
        });
    }
}

export default PrismaError;
