const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

dotenv.config();

const app = express();

// import route
const rootRoute = require("./routes/root.route");

// import middleware
const errorHandler = require("./middleware/errorHandler");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

// routes
app.use("/api", rootRoute);

app.use(errorHandler);

module.exports = app;

