export default {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["./src/tests"],
    transform: {
        "^.+\\.ts?$": "ts-jest",
    },
    testRegex: "(/.*tests.*.*(\\.|/)(test|spec))\\.ts?$",
    moduleFileExtensions: ["ts", "js", "json", "node"],
};
