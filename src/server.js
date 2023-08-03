import http from "http";
import { DEFAULT_LISTENING_PORT } from "./utils/constants.js";

export class Server {
  constructor(port) {
    this.port = port || DEFAULT_LISTENING_PORT;
  }
  start() {
    const server = http.createServer(this.handleRequest);
    server.listen(this.port, (_) => {
      console.info(`server is listening on port ${this.port}`);
    });
  }
  handleRequest(request, response) {
    response.end("hello world");
  }
}
