const express = require("express");
const mongoose = require("mongoose");

const Salary = require("../model/salary");
const salaryService = require("../service/salary.service");
const Util = require("../util/metadata.helper");

const router = express.Router();

router.get("/:id", async (req, res, next) => {
  let query = {
    _id: req.params.id,
  };

  let result = await salaryService.getSalaries(query);

  if (typeof result["error"] != "undefined") {
    res.status(500).json(result);
  } else {
    res.status(200).json(result);
  }
});

router.get("/by-pay-cycle/:payCycle", async (req, res, next) => {
  let query = {
    payCycle: req.params.payCycle,
  };

  let result = await salaryService.getSalaries(query);

  if (typeof result["error"] != "undefined") {
    res.status(500).json(result);
  } else {
    res.status(200).json(result);
  }
});

router.get("/by-employee/:employeeId", async (req, res, next) => {
  let query = {
    employeeId: req.params.employeeId,
  };

  let result = await salaryService.getSalaries(query);

  if (typeof result["error"] != "undefined") {
    res.status(500).json(result);
  } else {
    res.status(200).json(result);
  }
});

router.get(
  "/by-employee-pay-cycle/:employeeId/:payCycle",
  async (req, res, next) => {
    let query = {
      employeeId: req.params.employeeId,
      payCycle: req.params.payCycle,
    };

    let result = await salaryService.getSalaries(query);

    if (typeof result["error"] != "undefined") {
      res.status(500).json(result);
    } else {
      res.status(200).json(result);
    }
  }
);

router.post("/", (req, res, next) => {
  let calculatedSalary = 0;

  let promise = new Promise((resolve, reject) => {
    let salaryData = salaryService.getSalaryData({
      empId: req.body.employeeId,
      payCycle:
        req.body.payCycle == "" ? Util.getPayCycle() : req.body.payCycle,
    });

    resolve(salaryData);
  });

  promise.then(async (value) => {
    value = {
      ...value,
      bonus: typeof req.body.bonus == "undefined" ? 0 : req.body.bonus,
      reductions: typeof req.body.reductions == "undefined" ? 0 : req.body.reductions,
    };

    calculatedSalary = salaryService.calculateSalary(value);

    var salary = new Salary({
      _id: new mongoose.Types.ObjectId(),
      employeeId: req.body.employeeId,
      payCycle: req.body.payCycle == "" ? Util.getPayCycle() : req.body.payCycle,
      basic: value.basic,
      fixedAllowance: value.fixedAllowance,
      increment: value.increment,
      fixedCommissions: value.fixedCommissions,
      perUnitCommissions: value.perUnitCommissions,
      bonus: req.body.bonus,
      reductions: req.body.reductions,
      grossSalary: calculatedSalary.grossSalary,
      netSalary: calculatedSalary.netSalary,
      isPaid: req.body.isPaid,
    });

    let result = await salaryService.saveSalary(salary);

    if (typeof result["error"] != "undefined") {
      res.status(500).json(result);
    } else {
      res.status(200).json({ createdSalary: result });
    }
  });

});

router.put("/:id", async (req, res, next) => {
  let calculatedSalary = 0;

  let promise = new Promise((resolve, reject) => {
    let salaryData = salaryService.getSalaryData({
      empId: req.body.employeeId,
      payCycle:
        req.body.payCycle == "" ? Util.getPayCycle() : req.body.payCycle,
    });

    resolve(salaryData);
  });

  promise.then(async (value) => {
    value = {
      ...value,
      bonus: typeof req.body.bonus == "undefined" ? 0 : req.body.bonus,
      reductions: typeof req.body.reductions == "undefined" ? 0 : req.body.reductions,
    };

    calculatedSalary = salaryService.calculateSalary(value);

    var salary = new Salary({
      employeeId: req.body.employeeId,
      payCycle: req.body.payCycle == "" ? Util.getPayCycle() : req.body.payCycle,
      basic: value.basic,
      fixedAllowance: value.fixedAllowance,
      increment: value.increment,
      fixedCommissions: value.fixedCommissions,
      perUnitCommissions: value.perUnitCommissions,
      bonus: req.body.bonus,
      reductions: req.body.reductions,
      grossSalary: calculatedSalary.grossSalary,
      netSalary: calculatedSalary.netSalary,
      isPaid: req.body.isPaid,
    });

    let result = await salaryService.updateSalary(salary, req.params.id);

    if (typeof result["error"] != "undefined") {
      res.status(500).json(result);
    } else {
      res.status(200).json({ updatedSalary: result });
    }
  });

});

router.delete("/:id", async (req, res, next) => {
  let salary = new Salary({
    isDeleted: true,
  });

  let result = await salaryService.deleteSalary(salary, req.params.id);

  if (typeof result["error"] != "undefined") {
    res.status(500).json(result);
  } else {
    res.status(200).json({ deletedSalary: result });
  }
});

module.exports = router;
