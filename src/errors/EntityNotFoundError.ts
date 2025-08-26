import CustomError from "@/errors/customError";

class EntityNotFoundError extends CustomError<ErrorCode> {}

export default EntityNotFoundError;
