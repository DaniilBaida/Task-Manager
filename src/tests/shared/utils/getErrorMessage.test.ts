import { getErrorMessage } from "@/shared/utils";

describe("getErrorMessage", () => {
    it("returns Error message when passed Error instance", () => {
        const error = new Error("Something went wrong");
        expect(getErrorMessage(error)).toBe("Something went wrong");
    });

    it("returns message property when passed object with message", () => {
        const errorObj = { message: "API error" };
        expect(getErrorMessage(errorObj)).toBe("API error");
    });

    it("converts non-string message to string", () => {
        const errorObj = { message: 404 };
        expect(getErrorMessage(errorObj)).toBe("404");
    });

    it("returns string when passed string", () => {
        expect(getErrorMessage("Network error")).toBe("Network error");
    });

    it("returns fallback message for other types", () => {
        expect(getErrorMessage(null)).toBe("An error ocurred");
        expect(getErrorMessage(undefined)).toBe("An error ocurred");
        expect(getErrorMessage(123)).toBe("An error ocurred");
    });
});
