import http from "http";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";

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
        this.staticFileServe(request.url, response);
        // this.handleError(response, ...NOT_FOUND);
      }
    } catch (error) {
      console.error(error);
      this.handleError(response, ...INTERNAL_SERVER_ERROR);
    }
  }
  async staticFileServe(filePath, response) {
    const { NOT_FOUND } = HTTP_ERRORS;
    const fullFilePath = path.join(process.cwd(), "public", filePath);
    const stats = await fs.lstat(fullFilePath);
    const isFile = stats.isFile();
    const parsedFilePath = !isFile
      ? path.join(fullFilePath, "index.html")
      : fullFilePath;
    const pathExists = existsSync(parsedFilePath);
    console.log(parsedFilePath, filePath, stats.isFile());
    if (pathExists) {
      const data = await fs.readFile(parsedFilePath, { encoding: "utf-8" });
      response.end(data);
    } else {
      this.handleError(response, ...NOT_FOUND);
    }
  }
  handleError(response, statusCode, message) {
    response.writeHead(statusCode, { "Content-Type": "text/plain" });
    response.end(message);
  }
}
