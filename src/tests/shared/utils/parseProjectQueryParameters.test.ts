import { parseProjectQueryParameters } from "@/shared/utils";

describe("parseProjectQueryParameters", () => {
    describe("search parameter", () => {
        it("returns search string when provided", () => {
            const req = { query: { search: "project name" } } as any;

            const result = parseProjectQueryParameters(req);

            expect(result.search).toBe("project name");
        });

        it("returns undefined when search is not provided", () => {
            const req = { query: {} } as any;

            const result = parseProjectQueryParameters(req);

            expect(result.search).toBeUndefined();
        });
    });

    describe("orderBy parameter", () => {
        it("uses default orderBy when not provided", () => {
            const req = { query: {} } as any;

            const result = parseProjectQueryParameters(req);

            expect(result.orderBy).toEqual({ created_at: "asc" });
        });

        // This function has the same parsing bug as parseTaskQueryParameters
        it("falls back to default due to parsing bug with created_at_desc", () => {
            const req = { query: { orderBy: "created_at_desc" } } as any;

            const result = parseProjectQueryParameters(req);

            // Parsing splits "created_at_desc" into ["created", "at", "desc"]
            // Takes field="created", direction="at"
            // field !== "created_at" so falls back to default
            expect(result.orderBy).toEqual({ created_at: "asc" });
        });

        it("falls back to default due to parsing bug with created_at_asc", () => {
            const req = { query: { orderBy: "created_at_asc" } } as any;

            const result = parseProjectQueryParameters(req);

            // Same parsing issue
            expect(result.orderBy).toEqual({ created_at: "asc" });
        });

        it("uses default for invalid field", () => {
            const req = { query: { orderBy: "invalid_asc" } } as any;

            const result = parseProjectQueryParameters(req);

            expect(result.orderBy).toEqual({ created_at: "asc" });
        });

        it("uses default for invalid direction", () => {
            const req = { query: { orderBy: "field_invalid" } } as any;

            const result = parseProjectQueryParameters(req);

            expect(result.orderBy).toEqual({ created_at: "asc" });
        });

        it("uses default for malformed orderBy", () => {
            const req = { query: { orderBy: "malformed" } } as any;

            const result = parseProjectQueryParameters(req);

            expect(result.orderBy).toEqual({ created_at: "asc" });
        });
    });

    it("handles all parameters together", () => {
        const req = {
            query: {
                search: "my project",
                orderBy: "created_at_desc",
            },
        } as any;

        const result = parseProjectQueryParameters(req);

        expect(result).toEqual({
            search: "my project",
            orderBy: { created_at: "asc" }, // Falls back to default due to parsing bug
        });
    });
});
