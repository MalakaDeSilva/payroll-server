const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const AddOns = require("../model/add.ons");
const addOnsService = require("../service/add.ons.service");
const authService = require("../service/auth.service");

router.get(
  "/by-emp/:empId",
  authService.verifyToken,
  async (req, res, next) => {
    const empId = req.params.empId;
    let result = await addOnsService.getAddOnsByEmployeeId(empId);

    if (typeof result["error"] != "undefined") {
      res.status(200).json(result);
    } else {
      res.status(200).json(result);
    }
  }
);

router.get(
  "/by-emp-pay-cycle/:empId/:payCycle",
  authService.verifyToken,
  async (req, res, next) => {
    const empId = req.params.empId;
    const payCycle = req.params.payCycle;

    let result = await addOnsService.getAddOnsByEmployeeIdPayCycle(
      empId,
      payCycle
    );

    if (typeof result["error"] != "undefined") {
      res.status(200).json(result);
    } else {
      res.status(200).json(result);
    }
  }
);

router.get(
  "/by-pay-cycle/:payCycle",
  authService.verifyToken,
  async (req, res, next) => {
    const payCycle = req.params.payCycle;

    let result = await addOnsService.getAddOnsByPayCycle(payCycle);

    if (typeof result["error"] != "undefined") {
      res.status(200).json(result);
    } else {
      res.status(200).json(result);
    }
  }
);

router.get("/", authService.verifyToken, async (req, res, next) => {
  let result = await addOnsService.getAddOns();

  if (typeof result["error"] != "undefined") {
    res.status(200).json(result);
  } else {
    res.status(200).json(result);
  }
});

router.post("/", authService.verifyToken, async (req, res, next) => {
  var addOn = new AddOns({
    _id: new mongoose.Types.ObjectId(),
    employeeId: req.body.employeeId,
    increment: req.body.increment,
    fixedAllowance: req.body.fixedAllowance,
    bonus: typeof req.body.bonus != "undefined" ? req.body.bonus : 0,
    reductions:
      typeof req.body.reductions != "undefined" ? req.body.reductions : 0,
    fromPayCycle: req.body.fromPayCycle,
  });

  let result = await addOnsService.createAddOn(addOn);

  if (typeof result["error"] != "undefined") {
    res.status(200).json(result);
  } else {
    res.status(200).json({ createdAddOn: result });
  }
});

router.put("/:id", authService.verifyToken, async (req, res, next) => {
  var addOn = new AddOns({
    employeeId: req.body.employeeId,
    increment: req.body.increment,
    fixedAllowance: req.body.fixedAllowance,
    bonus: typeof req.body.bonus != "undefined" ? req.body.bonus : 0,
    reductions:
      typeof req.body.reductions != "undefined" ? req.body.reductions : 0,
    fromPayCycle: req.body.fromPayCycle,
  });

  let result = await addOnsService.updateAddOns(addOn, req.params.id);

  if (typeof result["error"] != "undefined") {
    res.status(200).json(result);
  } else {
    res.status(200).json({ updatedAddOn: result });
  }
});

router.delete("/:id", authService.verifyToken, async (req, res, next) => {
  var addOn = new AddOns({
    isDeleted: true,
  });

  let result = await addOnsService.updateAddOns(addOn, req.params.id);

  if (typeof result["error"] != "undefined") {
    res.status(200).json(result);
  } else {
    res.status(200).json({ deletedAddOn: result });
  }
});

module.exports = router;
