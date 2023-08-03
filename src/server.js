import http from "http";
import { DEFAULT_LISTENING_PORT } from "./utils/constants.js";
import { HTTP_ERRORS } from "./utils/errors.js";

export class Server {
  constructor(port) {
    this.port = port || DEFAULT_LISTENING_PORT;
    this.routes = {};
    this.handleRequest = this.handleRequest.bind(this);
  }
  start() {
    const server = http.createServer(this.handleRequest);
    server.listen(this.port, (_) => {
      console.info(`server is listening on port ${this.port}`);
    });
  }
  get(path, handler) {
    this.routes[`GET ${path}`] = handler;
  }
  handleRequest(request, response) {
    const { NOT_FOUND, INTERNAL_SERVER_ERROR } = HTTP_ERRORS;
    try {
      const { method, url } = request;
      const routeKey = `${method} ${url}`;
      const routeHandler = this.routes[routeKey];
      console.log(routeHandler, this.routes);
      if (routeHandler) {
        routeHandler(request, response);
      } else {
        this.handleError(response, ...NOT_FOUND);
      }
    } catch (error) {
      console.error(error);
      this.handleError(response, ...INTERNAL_SERVER_ERROR);
    }
  }
  handleError(response, statusCode, message) {
    response.writeHead(statusCode, { "Content-Type": "text/plain" });
    response.end(message);
  }
}
