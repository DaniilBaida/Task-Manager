import "express";
import { JwtPayload } from "jsonwebtoken";
import AuthenticationError from "./errors/AuthenticationError";

declare global {
    namespace Express {
        interface Request {
            auth?: {
                payload: JwtPayload;
                token: string;
            };
        }
    }
}
