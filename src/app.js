import "dotenv/config";
import { Server } from "./server.js";

const app = new Server();

app.start();
