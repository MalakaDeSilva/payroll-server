const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const Salary = require("../model/salary");
const salaryService = require("../service/salary.service");
const employeeService = require("../service/employee.service");
const designationService = require("../service/designation.service");
const authService = require("../service/auth.service");
const Util = require("../util/metadata.helper");

const router = express.Router();

router.get("/:id", async (req, res, next) => {
  let query = {
    _id: req.params.id,
  };

  let result = await salaryService.getSalaries(query);

  if (typeof result["error"] != "undefined") {
    res.status(200).json(result);
  } else {
    res.status(200).json(result);
  }
});

router.get(
  "/by-pay-cycle/:payCycle",
 
  async (req, res, next) => {
    let query = {
      payCycle: req.params.payCycle,
    };

    let result = await salaryService.getSalaries(query);

    if (typeof result["error"] != "undefined") {
      res.status(200).json(result);
    } else {
      res.status(200).json(result);
    }
  }
);

router.get(
  "/by-employee/:employeeId",
 
  async (req, res, next) => {
    let query = {
      employeeId: req.params.employeeId,
    };

    let result = await salaryService.getSalaries(query);

    if (typeof result["error"] != "undefined") {
      res.status(200).json(result);
    } else {
      res.status(200).json(result);
    }
  }
);

router.get(
  "/by-employee-pay-cycle/:employeeId/:payCycle",
 
  async (req, res, next) => {
    let query = {
      employeeId: req.params.employeeId,
      payCycle: req.params.payCycle,
    };

    let result = await salaryService.getSalaries(query);

    if (typeof result["error"] != "undefined") {
      res.status(200).json(result);
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
    calculatedSalary = salaryService.calculateSalary(value);

    var salary = new Salary({
      _id: new mongoose.Types.ObjectId(),
      employeeId: req.body.employeeId,
      payCycle:
        req.body.payCycle == "" ? Util.getPayCycle() : req.body.payCycle,
      basic: value.basic,
      fixedAllowance: value.fixedAllowance,
      increment: value.increment,
      fixedCommissions: value.fixedCommissions,
      perUnitCommissions: value.perUnitCommissions,
      bonus: value.bonus,
      reductions: value.reductions,
      grossSalary: calculatedSalary.grossSalary,
      netSalary: calculatedSalary.netSalary,
      isPaid: req.body.isPaid,
    });

    let result = await salaryService.saveSalary(salary);

    if (typeof result["error"] != "undefined") {
      res.status(200).json(result);
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
    calculatedSalary = salaryService.calculateSalary(value);

    var salary = new Salary({
      employeeId: req.body.employeeId,
      payCycle:
        req.body.payCycle == "" ? Util.getPayCycle() : req.body.payCycle,
      basic: value.basic,
      fixedAllowance: value.fixedAllowance,
      increment: value.increment,
      fixedCommissions: value.fixedCommissions,
      perUnitCommissions: value.perUnitCommissions,
      bonus: value.bonus,
      reductions: value.reductions,
      grossSalary: calculatedSalary.grossSalary,
      netSalary: calculatedSalary.netSalary,
      paid: req.body.paid,
    });

    let result = await salaryService.updateSalary(salary, req.params.id);

    if (typeof result["error"] != "undefined") {
      res.status(200).json(result);
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
    res.status(200).json(result);
  } else {
    res.status(200).json({ deletedSalary: result });
  }
});

router.get("/slip/get/:id", async (req, res, next) => {
  let file = fs.readFileSync(
    path.resolve(__dirname, "../assets/pay-slip-template.html"),
    "utf8"
  );

  let salary = await salaryService.getSalaries({ _id: req.params.id });
  let employee = await employeeService.getEmployeeByEmployeeId(
    salary[0]["employeeId"]
  );
  let designation = await designationService.getDesignationByCode(
    employee[0]["designation"]
  );

  const { year, month } = Util.getMonthYearFromPayCycle(salary[0]["payCycle"]);

  file = file.replace("$month", month);
  file = file.replace("$year", year);
  file = file.replace("$name", employee[0]["name"]);
  file = file.replace("$email", employee[0]["email"]);
  file = file.replace("$empId", employee[0]["employeeId"]);
  file = file.replace(
    "$joinedDate",
    new Date(employee[0]["joinedDate"]).toLocaleDateString()
  );
  file = file.replace("$designation", designation[0]["designationName"]);
  file = file.replace("$grossSal", salary[0]["grossSalary"]);
  file = file.replace("$basic", salary[0]["basic"]);
  file = file.replace("$basic", salary[0]["basic"]);
  file = file.replace("$grossSal", salary[0]["grossSalary"]);
  file = file.replace("$fixedAllowance", salary[0]["fixedAllowance"]);
  file = file.replace("$increment", salary[0]["increment"]);
  file = file.replace("$bonus", salary[0]["bonus"]);

  let fixedCommissions = "";
  if (salary[0]["fixedCommissions"].length !== 0) {
    salary[0]["fixedCommissions"].forEach((v) => {
      fixedCommissions += `<tr>
      <td>${v["commissionName"]}</td>
      <td>LKR ${v["commission"]}</td>
    <tr>`;
    });
  } else {
    fixedCommissions += `<tr>
    <td>-</td>
    <td>-</td>
  <tr>`;
  }

  file = file.replace("$fixedCommissions", fixedCommissions);

  let perUnitCommissions = "";
  if (salary[0]["perUnitCommissions"].length !== 0) {
    salary[0]["perUnitCommissions"].forEach((v) => {
      perUnitCommissions += `<tr>
      <td>${v["commissionName"]}</td>
      <td>${v["units"]}</td>
      <td>LKR ${v["commission"]}</td>
    <tr>`;
    });
  } else {
    perUnitCommissions += `<tr>
    <td>-</td>
    <td>-</td>
    <td>-</td>
  <tr>`;
  }

  file = file.replace("$perUnitCommissions", perUnitCommissions);
  file = file.replace("$reductions", salary[0]["reductions"]);
  file = file.replace("$netPay", salary[0]["netSalary"]);

  res.set("Content-Type", "text/html; charset=UTF-8");
  res.status(200).send(file);
});

router.get("/slip/generate/:id", async (req, res, next) => {
  let file = await salaryService.generatePDF(req.params.id);

  res.set({ "Content-Type": "application/pdf", "Content-Length": file.length });
  res.status(200).send(file);
});

module.exports = router;
