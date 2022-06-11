const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const AddOns = require("../model/add.ons");
const addOnsService = require("../service/add.ons.service");

router.get("/:empId", async (req, res, next) => {
  const empId = req.params.empId;
  let result = await addOnsService.getAddOnsByEmployeeId(empId);

  if (typeof result["error"] != "undefined") {
    res.status(500).json(result);
  } else {
    res.status(200).json(result);
  }
});

router.get("/", async (req, res, next) => {
  let result = await addOnsService.getAddOns();

  if (typeof result["error"] != "undefined") {
    res.status(500).json(result);
  } else {
    res.status(200).json(result);
  }
});

router.post("/", async (req, res, next) => {
  var addOn = new AddOns({
    employeeId: req.body.employeeId,
    increment: req.body.increment,
    fixedAllowance: req.body.fixedAllowance,
    fromPayCycle: req.body.fromPayCycle,
  });

  let result = await addOnsService.createUpdateAddOns(addOn, req.body.employeeId);

  if (typeof result["error"] != "undefined") {
    res.status(500).json(result);
  } else {
    res.status(200).json(result);
  }
});

router.put("/", async (req, res, next) => {

  var addOn = new AddOns({
    employeeId: req.body.employeeId,
    increment: req.body.increment,
    fixedAllowance: req.body.fixedAllowance,
    fromPayCycle: req.body.fromPayCycle,
  });

  let result = await addOnsService.createUpdateAddOns(addOn, req.body.employeeId);

  if (typeof result["error"] != "undefined") {
    res.status(500).json(result);
  } else {
    res.status(200).json(result);
  }
});

module.exports = router;
