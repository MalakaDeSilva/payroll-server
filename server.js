const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

const employeeRoutes = require("./api/routes/employeeController");

const PORT = process.env.PORT || 8080;
mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const http = require("http");
const server = http.Server(app);

app.use("/employees", employeeRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found.");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

server.listen(PORT, () => {
  console.log("Server is up and listening on : http://127.0.0.1:" + PORT);
});
