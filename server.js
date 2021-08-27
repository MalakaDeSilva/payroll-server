const express = require("express");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 8080;

app.use(cors());

const http = require("http");
const server = http.Server(app);

app.get("/", (req, res) => {
  res.json({ message: "තට්ට රාල පොල් පරාල" });
});

server.listen(PORT, () => {
  console.log("Server is up and listening on : http://127.0.0.1:" + PORT);
});