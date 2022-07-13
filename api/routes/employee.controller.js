const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Employee = require("../model/employee");
const employeeService = require("../service/employee.service");

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  let result = await employeeService.getEmployeeById(id);
  if (result["error"] != "undefined") {
    res.status(500).json(result);
  } else {
    res.status(200).json(result);
  }
});

router.get("/", async (req, res, next) => {
  let result = await employeeService.getEmployees();
  if (typeof result["error"] != "undefined") {
    res.status(500).json(result);
  } else {
    res.status(200).json(result);
  }
});

router.post("/", async (req, res, next) => {
  var employee = new Employee({
    _id: new mongoose.Types.ObjectId(),
    employeeId: req.body.employeeId,
    name: req.body.name,
    dob: req.body.dob,
    email: req.body.email,
    joinedDate: req.body.date,
    phone: req.body.phone,
    salary: req.body.salary,
    NIC: req.body.nic,
    designation: req.body.designation,
  });

  let result = await employeeService.addEmployee(employee);

  if (typeof result["error"] != "undefined") {
    res.status(500).json(result);
  } else {
    res.status(200).json({
      createdEmployee: result,
    });
  }
});

router.put("/:id", async (req, res, next) => {
  let _id = req.params.id;

  var employee = new Employee({
    employeeId: req.body.employeeId,
    name: req.body.name,
    dob: req.body.dob,
    email: req.body.email,
    joinedDate: req.body.date,
    phone: req.body.phone,
    salary: req.body.salary,
    NIC: req.body.nic,
    designation: req.body.designation,
    status: req.body.status,
  });

  let result = await employeeService.updateEmployee(employee, _id);
  if (typeof result["error"] != "undefined") {
    res.status(500).json(result);
  } else {
    res.status(200).json({
      updatedEmployee: result,
    });
  }
});

router.delete("/:id", async (req, res, next) => {
  let _id = req.params.id;

  var employee = new Employee({
    isDeleted: true,
  });

  let result = await employeeService.updateEmployee(employee, _id);
  if (typeof result["error"] != "undefined") {
    res.status(500).json(result);
  } else {
    res.status(200).json({
      deletedEmployee: result,
    });
  }
});

module.exports = router;
