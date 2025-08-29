import CustomError from "@/shared/errors/customError";
import { ErrorCode } from "./types";

class EntityNotFoundError extends CustomError<ErrorCode> {}

export default EntityNotFoundError;
