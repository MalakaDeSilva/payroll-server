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

router.post("/verify", (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];

    let result = authService.checkTokenValidity(bearerToken);
    if (result["verified"]) {
      res.status(200).json({ ...result });
    } else {
      res.status(403).json({ ...result });
    }
  } else {
    res.status(403).json({
      verified: false,
      error: {
        name: "JsonWebTokenError",
        message: "empty token",
      },
    });
  }
});

module.exports = router;
