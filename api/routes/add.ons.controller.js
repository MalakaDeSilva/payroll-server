const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const AddOns = require("../model/add.ons");

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  AddOns.findById(id)
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for the provided ID." });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.get("/", (req, res, next) => {
  AddOns.find()
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "No valid entries found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.post("/", (req, res, next) => {
  var addOn = new AddOns({
    _id: new mongoose.Types.ObjectId(),
    employee: req.body.employeeId,
    increment: req.body.increment,
    fixedAllowance: req.body.fixedAllowance,
  });

  addOn
    .save()
    .then((result) => {
      res.status(200).json({
        createdAddOn: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/:id", (req, res, next) => {
  var query = {
    _id: req.params.id,
  };

  var addOns = new AddOns({
    employee: req.body.employeeId,
    increment: req.body.increment,
    fixedAllowance: req.body.fixedAllowance,
  });

  addOns
    .findOneAndUpdate(query, addOns)
    .then((result) => {
      res.status(200).json({
        updatedAddOn: result,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
