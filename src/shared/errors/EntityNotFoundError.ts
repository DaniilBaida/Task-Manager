import CustomError from "@/shared/errors/customError";
import { ErrorCode } from "./types";

class EntityNotFoundError extends CustomError<ErrorCode> {
    static create(entityType: string, identifier: string): EntityNotFoundError {
        return new EntityNotFoundError({
            message: `${entityType} with ID "${identifier}" not found`,
            statusCode: 404,
            code: "ERR_NF",
        });
    }
}

export default EntityNotFoundError;
