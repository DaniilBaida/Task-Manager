const config = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.PORT || "3000"),
    APP_DEBUG: process.env.APP_DEBUG === "true",
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
    APP_SECRET: process.env.APP_SECRET || "",
    ISSUER_BASE_URL: process.env.ISSUER_BASE_URL || "",
    AUDIENCE: process.env.AUDIENCE || "",
    DEFAULT_PAGE_SIZE: parseInt(process.env.DEFAULT_PAGE_SIZE || "5"),
};

export default config;
