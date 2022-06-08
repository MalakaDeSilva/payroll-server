const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Employee = require("../model/employee");

router.get("/:employeeId", (req, res, next) => {
  const id = req.params.employeeId;
  Employee.findById(id)
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
  Employee.find()
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
  var employee = new Employee({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    NIC: req.body.nic,
    employeeType: req.body.type,
  });

  employee
    .save()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });

  res.status(200).json({
    createdEmployee: employee,
  });
});

router.put("/:employeeId", (req, res, next) => {
  var query = {
    _id: req.params.employeeId,
  };

  var employee = new Employee({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    NIC: req.body.nic,
    employeeType: req.body.type,
  });

  Employee.findOneAndUpdate(query, employee)
    .then((employee) => {
      res.status(200).json(employee);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
