import { Request } from "express";
import config from "./config/config";

export function add(a: number, b: number) {
    return a + b;
}

export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    if (error && typeof error === "object" && "message" in error) {
        return String(error.message);
    }

    if (typeof error === "string") {
        return error;
    }

    return "An error ocurred";
}

export function getPaginationParameters(req: Request) {
    const perPage = parseInt(req.query.perPage as string, 10);

    const limit =
        isNaN(perPage) || perPage < 1 ? config.DEFAULT_PAGE_SIZE : perPage;
    const nextCursor = req.query.nextCursor as string | undefined;
    const prevCursor = req.query.prevCursor as string | undefined;

    return {
        limit,
        nextCursor: nextCursor ? decodeBase64(nextCursor) : undefined,
        prevCursor: prevCursor ? decodeBase64(prevCursor) : undefined,
    };
}

export function encodeBase64(input: string) {
    return Buffer.from(input).toString("base64");
}

export function decodeBase64(input: string) {
    return Buffer.from(input, "base64").toString("utf-8");
}
