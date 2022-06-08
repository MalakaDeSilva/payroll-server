const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Commission = require("../model/per.unit.commission");
const metadataHelper = require("../util/metadata.helper");

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Commission.findById(id)
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
  Commission.find()
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
  var commission = new Commission({
    _id: new mongoose.Types.ObjectId(),
    commissionName: req.body.name,
    amount: req.body.amount,
    units: req.body.units,
    employee: req.body.employee,
    payCycle: metadataHelper.getPayCycle(req.body.payCycle),
  });

  commission
    .save()
    .then((result) => {
      res.status(200).json({
        createdCommission: result,
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

  var commission = new Commission({
    commissionName: req.body.name,
    amount: req.body.amount,
    units: req.body.units,
    employee: req.body.employee,
    payCycle: metadataHelper.getPayCycle(req.body.payCycle),
  });

  commission
    .findOneAndUpdate(query, commission)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
