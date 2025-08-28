import { Prisma, PrismaClient } from "@prisma/client";
import { IQueryParameters } from "./types";

export default class BaseRepository {
    protected defaultLimit = 10;
    protected defaultOffset = 0;
    protected client: PrismaClient;
    constructor() {
        this.client = new PrismaClient();
    }

    getClient() {
        return this.client;
    }

    protected getPaginationQueryParameters(query: IQueryParameters) {
        const limit = query.limit || this.defaultLimit;
        let sortOrder: Prisma.SortOrder = "asc";
        let operator: string = "gt";
        let cursor = query?.nextCursor;

        if (query.prevCursor) {
            sortOrder = "desc";
            operator = "lt";
            cursor = query.prevCursor;
        }

        return { limit, sortOrder, operator, cursor };
    }

    protected getPaginationCursors(
        query: IQueryParameters,
        entities: Prisma.TaskGetPayload<{}>[] | Prisma.ProjectGetPayload<{}>[],
        limit: number,
        sortOrder: string
    ): { nextCursorTimestamp: Date | null; prevCursorTimestamp: Date | null } {
        const hasMoreResults = entities.length > limit;
        if (hasMoreResults) entities.pop();

        if (entities.length === 0) {
            return { nextCursorTimestamp: null, prevCursorTimestamp: null };
        }

        const firstTimestamp = entities[0].created_at;
        const lastTimestamp = entities[entities.length - 1].created_at;

        if (sortOrder === "asc") {
            return {
                nextCursorTimestamp: hasMoreResults ? lastTimestamp : null,
                prevCursorTimestamp: query.nextCursor ? firstTimestamp : null,
            };
        }

        return {
            nextCursorTimestamp: query.prevCursor ? firstTimestamp : null,
            prevCursorTimestamp: hasMoreResults ? lastTimestamp : null,
        };
    }
}

export type Constructor<T = {}> = new (...args: any[]) => T;
