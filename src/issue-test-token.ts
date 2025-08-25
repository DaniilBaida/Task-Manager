import jwt from "jsonwebtoken";
import config from "./config/config";
const payload = {
    sub: "97d682e5-148c-4c42-b04c-8c1aa04bba71",
};

const token = jwt.sign(payload, config.APP_SECRET, {
    expiresIn: "1hr",
    issuer: "task-manager-app",
});

console.log(token);
