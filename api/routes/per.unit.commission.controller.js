const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Commission = require("../model/per.unit.commission");
const metadataHelper = require("../util/metadata.helper");
const commissionService = require("../service/per.unit.commission.service");

router.get("/:empId/:payCycle", async (req, res, next) => {
  const empId = req.params.empId;
  const payCycle = req.params.payCycle;

  let result = await commissionService.getCommissionByEmployeePayCycle(
    empId,
    payCycle
  );

  if (typeof result["error"] != "undefined") {
    res.status(500).json(result);
  } else {
    res.status(200).json(result);
  }
});

router.get("/:payCycle", async (req, res, next) => {
  const payCycle = req.params.payCycle;
  let result = await commissionService.getCommissionsByPayCyle(payCycle);

  if (typeof result["error"] != "undefined") {
    res.status(500).json(result);
  } else {
    res.status(200).json(result);
  }
});

router.post("/", async (req, res, next) => {
  var commission = new Commission({
    _id: new mongoose.Types.ObjectId(),
    commissionName: req.body.name,
    amount: req.body.amount,
    units: req.body.units,
    employeeId: req.body.employeeId,
    payCycle: metadataHelper.getPayCycle(req.body.payCycle),
  });

  let result = await commissionService.addCommission(commission);

  if (typeof result["error"] != "undefined") {
    res.status(500).json(result);
  } else {
    res.status(200).json({ createdCommission: result });
  }
});

router.put("/:id", async (req, res, next) => {
  let id = req.params.id;

  var commission = new Commission({
    commissionName: req.body.name,
    amount: req.body.amount,
    units: req.body.units,
    employeeId: req.body.employeeId,
    payCycle: metadataHelper.getPayCycle(req.body.payCycle),
  });

  let result = await commissionService.updateCommission(commission, id);

  if (typeof result["error"] != "undefined") {
    res.status(500).json(result);
  } else {
    res.status(200).json({ updatedCommission: result });
  }
});

router.delete("/:id", async (req, res, next) => {
  let id = req.params.id;

  var commission = new Commission({
    isDeleted: true,
  });

  let result = await commissionService.updateCommission(commission, id);

  if (typeof result["error"] != "undefined") {
    res.status(500).json(result);
  } else {
    res.status(200).json({ deletedCommission: result });
  }
});

module.exports = router;
