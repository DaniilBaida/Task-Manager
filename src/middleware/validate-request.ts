import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export default function validateRequest<T>(schema: ZodType<T>) {
    return function validator(req: Request, res: Response, next: NextFunction) {
        const validated = schema.parse(req.body);
        req.body = validated;
        next();
    };
}
