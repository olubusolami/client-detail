const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Welcome to  a safe place for your dream house");
});

module.exports = router;
