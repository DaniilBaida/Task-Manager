import CustomError from "@/shared/errors/customError";
import { ErrorCode } from "./types";

class EntityNotFoundError extends CustomError<ErrorCode> {
    constructor(entityType: string, identifier: string) {
        super({
            message: `${entityType} with ID "${identifier}" not found`,
            statusCode: 404,
            code: "ERR_NF",
        });
    }
}

export default EntityNotFoundError;
