import { auth } from "express-oauth2-jwt-bearer";
import config from "../config/config";

const authenticateUser = auth({
    audience: config.AUDIENCE,
    issuerBaseURL: config.ISSUER_BASE_URL,
});

export default authenticateUser;
