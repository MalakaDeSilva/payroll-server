const express = require("express");

const router = express.Router();

const authService = require("../service/auth.service");

router.post("/login", async (req, res, next) => {
  let result = await authService.login(req.body.email, req.body.password);

  if (typeof result["error"] != "undefined") {
    res.status(200).json(result);
  } else {
    res.status(200).json(result);
  }
});

module.exports = router;
