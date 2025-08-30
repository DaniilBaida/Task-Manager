import { encodeCursor } from "@/shared/utils";

describe("encodeCursor", () => {
    it("returns null when input is null", () => {
        expect(encodeCursor(null)).toBeNull();
    });

    it("encodes date to base64 string when date provided", () => {
        const testDate = new Date("2023-01-01T00:00:00.000Z");
        
        const result = encodeCursor(testDate);
        
        expect(result).toBeDefined();
        expect(typeof result).toBe("string");
        
        // Decode to verify it contains the correct ISO string
        const decoded = Buffer.from(result!, "base64").toString("utf-8");
        expect(decoded).toBe("2023-01-01T00:00:00.000Z");
    });

    it("handles different dates correctly", () => {
        const date1 = new Date("2023-06-15T10:30:00.000Z");
        const date2 = new Date("2024-12-25T23:59:59.999Z");
        
        const cursor1 = encodeCursor(date1);
        const cursor2 = encodeCursor(date2);
        
        expect(cursor1).not.toBe(cursor2);
        expect(cursor1).toBeTruthy();
        expect(cursor2).toBeTruthy();
    });
});