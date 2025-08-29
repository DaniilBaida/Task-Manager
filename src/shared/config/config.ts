const config = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.PORT || "3000"),
    APP_DEBUG: process.env.APP_DEBUG === "true",
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
    APP_SECRET: process.env.APP_SECRET || "",
    ISSUER_BASE_URL: process.env.ISSUER_BASE_URL || "",
    AUDIENCE: process.env.AUDIENCE || "",
    DEFAULT_PAGE_SIZE: parseInt(process.env.DEFAULT_PAGE_SIZE || "5"),
    MAIL: {
        MAILER: process.env.MAIL_MAILER || "",
        HOST: process.env.MAIL_HOST || "",
        PORT: Number(process.env.MAIL_PORT || 0),
        USERNAME: process.env.MAIL_USERNAME || "",
        PASSWORD: process.env.MAIL_PASSWORD || "",
        ADMIN_EMAIL: process.env.ADMIN_EMAIL || "",
    },
    CONSOLE_LOG_EMAILS: process.env.CONSOLE_LOG_EMAILS === "true",
};

export default config;
