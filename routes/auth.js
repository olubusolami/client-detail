const express = require("express");
const app = express();
const authController = require("../controllers/auth");

//login as an admin
app.post("/register", authController.signup);

//login as an admin
app.get("/verify/:token", authController.token);

//login as an admin
app.post("/login", authController.login);

module.exports = app;
