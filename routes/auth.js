const express = require("express");
const app = express();
const authController = require("../controllers/auth");
const auth = require("../email/email-util");

//login as an admin
app.post("/register", authController.signup);

//login as an admin
app.get("//verify/:token", authController.token);

//login as an admin
app.post("/login", authController.login);

//login as an admin
app.post("/send", auth.sendEmail);

module.exports = app;
