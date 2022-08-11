const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const router = express.Router();

const Employee = require("../model/employee");
const User = require("../model/user");
const employeeService = require("../service/employee.service");
const authService = require("../service/auth.service");
const userService = require("../service/user.service");

const saltRounds = 10;

router.get("/:id", authService.verifyToken, async (req, res, next) => {
  const id = req.params.id;
  let result = await employeeService.getEmployeeById(id);
  if (typeof result["error"] != "undefined") {
    res.status(200).json(result);
  } else {
    res.status(200).json(result);
  }
});

router.get("/", authService.verifyToken, async (req, res, next) => {
  let result = await employeeService.getEmployees();
  if (typeof result["error"] != "undefined") {
    res.status(200).json(result);
  } else {
    res.status(200).json(result);
  }
});

router.post("/", authService.verifyToken, async (req, res, next) => {
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

  let hash = await bcrypt.hash(req.body.employeeId, saltRounds);
  let user = new User({
    _id: new mongoose.Types.ObjectId(),
    userId: req.body.employeeId,
    email: req.body.email,
    password: hash,
    role: req.body.role,
  });

  try {
    await userService.addUser(user);
  } catch (error) {}

  let result = await employeeService.addEmployee(employee);

  if (typeof result["error"] != "undefined") {
    res.status(200).json(result);
  } else {
    res.status(200).json({
      createdEmployee: result,
    });
  }
});

router.put("/:id", authService.verifyToken, async (req, res, next) => {
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
    res.status(200).json(result);
  } else {
    res.status(200).json({
      updatedEmployee: result,
    });
  }
});

router.delete("/:id", authService.verifyToken, async (req, res, next) => {
  let _id = req.params.id;

  var employee = new Employee({
    isDeleted: true,
  });

  let result = await employeeService.updateEmployee(employee, _id);
  if (typeof result["error"] != "undefined") {
    res.status(200).json(result);
  } else {
    res.status(200).json({
      deletedEmployee: result,
    });
  }
});

module.exports = router;
