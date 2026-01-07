import http from "http";
import app from "./app";
import { initSocket } from "./socket/socket.server";
import { ENV } from "./config/env";

const server = http.createServer(app);
initSocket(server);

server.listen(ENV.PORT, () => {
  console.log(`Server running on http://localhost:${ENV.PORT}`);
});
