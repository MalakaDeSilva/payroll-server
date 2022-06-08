const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Designation = require("../model/designation");

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Designation.findById(id)
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
  Designation.find()
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
  var designation = new Designation({
    _id: new mongoose.Types.ObjectId(),
    designationCode: req.body.code,
    designationName: req.body.name,
    payRange: req.body.payRange,
  });

  designation
    .save()
    .then((result) => {
      res.status(200).json({
        createdDesignation: result,
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

  var designation = new Designation({
    designationCode: req.body.code,
    designationName: req.body.name,
    payRange: req.body.payRange,
  });

  Designation.findOneAndUpdate(query, designation)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
