import { NextFunction, Request, Response } from "express";

import { getErrorMessage } from "@/shared/utils";
import config from "@/shared/config/config";
import CustomError from "@/shared/errors/customError";
import { UnauthorizedError } from "express-oauth2-jwt-bearer";
import { Prisma } from "@prisma/client";
import PrismaError from "@/shared/errors/PrismaError";
import { ValidationError } from "@/shared/errors/types";
import z from "zod";

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

    if (error instanceof z.ZodError) {
        const validationError: ValidationError = {
            error: {
                message: "Validation Error",
                code: "ERR_VALID",
                errors: error.issues.map((err) => ({
                    message: err.message,
                })),
            },
        };
        res.status(400).json(validationError);
        return;
    }

    if (error instanceof CustomError) {
        res.status(error.statusCode).json({
            error: { message: error.message, code: error.code },
        });
        return;
    }

    if (error instanceof UnauthorizedError) {
        res.status(error.statusCode).json({
            error: {
                message: error.message,
                code: "code" in error ? error.code : "ERR_AUTH",
            },
        });
        return;
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const prismaError = new PrismaError(error);
        res.status(prismaError.statusCode).json({
            error: { message: prismaError.message, code: prismaError.code },
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
