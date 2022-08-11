const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const router = express.Router();

const User = require("../model/user");
const userService = require("../service/user.service");
const saltRounds = 10;

router.get("/get-user/:email", async (req, res, next) => {
  let email = req.params.email;

  let result = await userService.getUserByEmail(email);

  if (typeof result["error"] != "undefined") {
    res.status(200).json(result);
  } else {
    if (result.length === 1) {
      res.status(200).json(result[0]);
    } else {
      res.status(200).json({ error: "No user found." });
    }
  }
});

router.post("/add-user", async (req, res, next) => {
  let hash = await bcrypt.hash(req.body.password, saltRounds);
  let user = new User({
    _id: new mongoose.Types.ObjectId(),
    userId: req.body.userId,
    email: req.body.email,
    password: hash,
  });

  let result = await userService.addUser(user);
  if (typeof result["error"] != "undefined") {
    res.status(200).json(result);
  } else {
    res.status(200).json(result);
  }
});

router.put("/update-password", async (req, res, next) => {
  let existingUser = await userService.getUserByEmail(req.body.email);
  if (typeof existingUser[0]["error"] != "undefined") {
    res.status(200).json({ error: "No existing user." });
  } else {
    let match = await bcrypt.compare(
      req.body.oldPassword,
      existingUser[0].password
    );

    if (match) {
      let hash = await bcrypt.hash(req.body.password, saltRounds);

      let user = new User({
        password: hash,
        isFirstTime: false,
      });

      let result = await userService.updatePassword(user, req.body.email);
      if (typeof result["error"] != "undefined") {
        res.status(200).json(result);
      } else {
        res.status(200).json(result);
      }
    } else {
      res.status(200).json({ error: "Password does not match." });
    }
  }
});

router.delete("/resigned/:email", async (req, res, next) => {
  let result = await userService.markAsResigned(req.body.email);

  if (typeof result["error"] != "undefined") {
    res.status(200).json(result);
  } else {
    res.status(200).json(result);
  }
});

module.exports = router;
