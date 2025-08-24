import { NextFunction, Request, Response } from "express";

import { getErrorMessage } from "../utils";
import config from "../config/config";
import CustomError from "../errors/customError";

export const errorHandler = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (res.headersSent || config.APP_DEBUG) {
        next(error);
        return;
    }

    if (error instanceof CustomError) {
        res.status(error.statusCode).json({
            error: { message: error.message, code: error.code },
        });
        return;
    }

    res.status(500).json({
        error: {
            message:
                getErrorMessage(error) ||
                "An error ocurred. Please view logs for more details",
        },
    });
};
