import { PORT } from "./config/config";
import { createServer } from "./server";

const server = createServer();

const SERVER_PORT = PORT || 3000;

server.listen(SERVER_PORT, () => {
    console.log(`API Running on http://localhost:${SERVER_PORT}`);
});
