const config = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.PORT || "3000"),
    APP_DEBUG: process.env.APP_DEBUG === "true",
};

export default config;
