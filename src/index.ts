import "module-alias/register";

import config from "@/shared/config/config";
import { createServer } from "@/server";

const server = createServer();

server.listen(config.PORT, () => {
    console.log(`API Running on http://localhost:${config.PORT}`);
});
