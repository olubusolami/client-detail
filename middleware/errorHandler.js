const validator = require("validator");
exports.signupHandler = (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).json({
      status: "error",
      message: "Your full name is required!",
    });
  }

  if (!req.body.email) {
    return res.status(400).json({
      status: "error",
      message: "Your valid Email is required!",
    });
  }

  if (!validator.isEmail) {
    return res.status(400).json({
      status: "error",
      message: "Please enter a valid E-mail",
    });
  }

  return next();
};

exports.signupHandler;
