const config = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.PORT || "3000"),
    APP_DEBUG: process.env.APP_DEBUG === "true",
    APP_SECRET: process.env.APP_SECRET || "",
    ISSUER_BASE_URL: process.env.ISSUER_BASE_URL || "",
    AUDIENCE: process.env.AUDIENCE || "",
};

export default config;
