import { parseTaskQueryParameters } from "@/shared/utils";

describe("parseTaskQueryParameters", () => {
    describe("search parameter", () => {
        it("returns search string when provided", () => {
            const req = { query: { search: "task name" } } as any;

            const result = parseTaskQueryParameters(req);

            expect(result.search).toBe("task name");
        });

        it("returns undefined when search is not provided", () => {
            const req = { query: {} } as any;

            const result = parseTaskQueryParameters(req);

            expect(result.search).toBeUndefined();
        });
    });

    describe("completed parameter", () => {
        it('returns true for "true"', () => {
            const req = { query: { completed: "true" } } as any;

            const result = parseTaskQueryParameters(req);

            expect(result.completed).toBe(true);
        });

        it('returns true for "1"', () => {
            const req = { query: { completed: "1" } } as any;

            const result = parseTaskQueryParameters(req);

            expect(result.completed).toBe(true);
        });

        it('returns false for "false"', () => {
            const req = { query: { completed: "false" } } as any;

            const result = parseTaskQueryParameters(req);

            expect(result.completed).toBe(false);
        });

        it('returns false for "0"', () => {
            const req = { query: { completed: "0" } } as any;

            const result = parseTaskQueryParameters(req);

            expect(result.completed).toBe(false);
        });

        it("handles case insensitive values", () => {
            const req = { query: { completed: "TRUE" } } as any;

            const result = parseTaskQueryParameters(req);

            expect(result.completed).toBe(true);
        });

        it("returns undefined for invalid values", () => {
            const req = { query: { completed: "invalid" } } as any;

            const result = parseTaskQueryParameters(req);

            expect(result.completed).toBeUndefined();
        });

        it("returns undefined when not provided", () => {
            const req = { query: {} } as any;

            const result = parseTaskQueryParameters(req);

            expect(result.completed).toBeUndefined();
        });
    });

    describe("orderBy parameter", () => {
        it("uses default orderBy when not provided", () => {
            const req = { query: {} } as any;

            const result = parseTaskQueryParameters(req);

            expect(result.orderBy).toEqual({ created_at: "asc" });
        });

        it("uses default for invalid field", () => {
            const req = { query: { orderBy: "invalid_asc" } } as any;

            const result = parseTaskQueryParameters(req);

            expect(result.orderBy).toEqual({ created_at: "asc" });
        });

        it("uses default for invalid direction", () => {
            const req = { query: { orderBy: "created_invalid" } } as any;

            const result = parseTaskQueryParameters(req);

            expect(result.orderBy).toEqual({ created_at: "asc" });
        });

        it("uses default for malformed orderBy", () => {
            const req = { query: { orderBy: "malformed" } } as any;

            const result = parseTaskQueryParameters(req);

            expect(result.orderBy).toEqual({ created_at: "asc" });
        });
    });
});
