import config from "@/shared/config/config";
import { getPaginationParameters } from "@/shared/utils";
import { Request } from "express";

describe("getPaginationParameters", () => {
    describe("limit handling", () => {
        it("uses valid perPage value as limit", () => {
            const req = { query: { perPage: "15" } } as unknown as Request;

            const result = getPaginationParameters(req);

            expect(result.limit).toBe(15);
        });

        it("uses default page size when perPage is invalid", () => {
            const req = { query: { perPage: "invalid" } } as unknown as Request;

            const result = getPaginationParameters(req);

            expect(result.limit).toBe(config.DEFAULT_PAGE_SIZE);
        });

        it("uses default page size when perPage is less than 1", () => {
            const req = { query: { perPage: "0" } } as unknown as Request;

            const result = getPaginationParameters(req);

            expect(result.limit).toBe(config.DEFAULT_PAGE_SIZE);
        });

        it("uses default page size when perPage is missing", () => {
            const req = { query: {} } as Request;

            const result = getPaginationParameters(req);

            expect(result.limit).toBe(config.DEFAULT_PAGE_SIZE);
        });
    });

    describe("cursor handling", () => {
        it("decodes nextCursor when provided", () => {
            const req = {
                query: { nextCursor: "encoded-next" },
            } as unknown as Request;

            const result = getPaginationParameters(req);

            expect(result.nextCursor).toBeDefined();
            expect(typeof result.nextCursor).toBe("string");
        });

        it("decodes prevCursor when provided", () => {
            const req = {
                query: { prevCursor: "encoded-prev" },
            } as unknown as Request;

            const result = getPaginationParameters(req);

            expect(result.prevCursor).toBeDefined();
            expect(typeof result.prevCursor).toBe("string");
        });

        it("returns undefined cursors when not provided", () => {
            const req = { query: {} } as Request;

            const result = getPaginationParameters(req);

            expect(result.nextCursor).toBeUndefined();
            expect(result.prevCursor).toBeUndefined();
        });
    });

    it("handles complete pagination parameters", () => {
        const req = {
            query: {
                perPage: "25",
                nextCursor: "encoded-next",
                prevCursor: "encoded-prev",
            },
        } as any;

        const result = getPaginationParameters(req);

        expect(result.limit).toBe(25);
        expect(result.nextCursor).toBeDefined();
        expect(result.prevCursor).toBeDefined();
    });
});
