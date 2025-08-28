type ErrorCode =
    | "ERR_NF"
    | "ERR_VALID"
    | "ERR_AUTH"
    | "ERR_DUPLICATE"
    | "ERR_FK"
    | "ERR_CONSTRAINT"
    | "ERR_REQUIRED_RELATION"
    | "ERR_INVALID_OP"
    | "ERR_DB";

type ValidationError = {
    error: {
        message: string;
        code: ErrorCode;
        errors: { message: string }[];
    };
};
