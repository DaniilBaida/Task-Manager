import { Request } from "express";
import config from "./config/config";
import {
    IProjectQueryParameters,
    ITaskQueryParameters,
} from "./data/repositories/types";

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

export function parseTaskQueryParameters(req: Request): ITaskQueryParameters {
    const {
        search,
        completed: completedParam,
        orderBy: orderByParam,
    } = req.query;

    let completed: boolean | undefined = undefined;
    if (completedParam !== undefined) {
        const value = String(completedParam).toLowerCase();
        completed = ["true", "1"].includes(value)
            ? true
            : ["false", "0"].includes(value)
              ? false
              : undefined;
    }

    let orderBy: ITaskQueryParameters["orderBy"] = { created_at: "asc" };
    if (typeof orderByParam === "string") {
        const [field, direction] = orderByParam.split("_");
        if (
            ["created_at", "due_date"].includes(field) &&
            ["asc", "desc"].includes(direction)
        ) {
            orderBy = { [field]: direction as "asc" | "desc" };
        }
    }

    return { search: search as string | undefined, completed, orderBy };
}

export function parseProjectQueryParameters(
    req: Request
): IProjectQueryParameters {
    const { search, orderBy: orderByParam } = req.query;

    let orderBy: IProjectQueryParameters["orderBy"] = { created_at: "asc" };
    if (typeof orderByParam === "string") {
        const [field, direction] = orderByParam.split("_");
        if (field === "created_at" && ["asc", "desc"].includes(direction)) {
            orderBy = { created_at: direction as "asc" | "desc" };
        }
    }

    return { search: search as string | undefined, orderBy };
}
