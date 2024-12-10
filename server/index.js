import express from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import cookieParser from "cookie-parser";

// configs
import "dotenv/config";
import "./configs/db.js";
import initializeSocket from "./configs/socket.js";

// routes
import authRoute from "./routes/authRoute.js";
import documentRoute from "./routes/documentRoute.js";
import notificationRoute from "./routes/notificationRoute.js";

const PORT = process.env.PORT || 5000;
const app = express();
const api = "/api/v1";
const server = http.createServer(app);
const io = initializeSocket(server);

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(helmet());

// routes
app.use(`${api}/auth`, authRoute);
app.use(
  `${api}/documents`,
  (req, res, next) => ((req.io = io), next()),
  documentRoute
);
app.use(`${api}/notifications`, notificationRoute);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});
