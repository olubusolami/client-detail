const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const { signupHandler } = require("./middleware/errorHandler");

//import routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

(async function db() {
  await connection();
})();

app.use(cors());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

//middleware
app.use(express.json());

//route middleware
app.use("/user", signupHandler, authRoute);
app.use("/", authRoute);
app.use("/", postRoute);

//404 error
app.use((req, res, next) => {
  res.status(404).json({
    message: "Ohh you are lost, tap back to find your way back home :)",
  });
});

port = process.env.PORT || 3000;
app.listen(port, () => console.log("up and running well"));
