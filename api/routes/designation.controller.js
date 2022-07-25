const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Designation = require("../model/designation");
const designationService = require("../service/designation.service");
const authService = require("../service/auth.service");

router.get("/", async (req, res, next) => {
  let result = await designationService.getDesignations();

  if (typeof result["error"] != "undefined") {
    res.status(200).json(result);
  } else {
    res.status(200).json(result);
  }
});

router.get("/:code", async (req, res, next) => {
  const desigCode = req.params.code;
  let result = await designationService.getDesignationByCode(desigCode);

  if (typeof result["error"] != "undefined") {
    res.status(200).json(result);
  } else {
    res.status(200).json(result);
  }
});

router.post("/", async (req, res, next) => {
  var designation = new Designation({
    _id: new mongoose.Types.ObjectId(),
    designationCode: req.body.code,
    designationName: req.body.name,
    salaryRange: {
      from: req.body.salFrom,
      to: req.body.salTo,
    },
  });

  let result = await designationService.addDesignation(designation);

  if (typeof result["error"] != "undefined") {
    res.status(200).json(result);
  } else {
    res.status(200).json({
      createdDesignation: result,
    });
  }
});

router.put("/:id", async (req, res, next) => {
  var designation = new Designation({
    designationCode: req.body.code,
    designationName: req.body.name,
    salaryRange: {
      from: req.body.salFrom,
      to: req.body.salTo,
    },
  });

  let result = await designationService.updateDesignation(
    designation,
    req.params.id
  );
  if (typeof result["error"] != "undefined") {
    res.status(200).json(result);
  } else {
    res.status(200).json({
      updatedDesignation: result,
    });
  }
});

router.delete("/:id", async (req, res, next) => {
  var designation = new Designation({
    isDeleted: true,
  });

  let result = await designationService.updateDesignation(
    designation,
    req.params.id
  );
  if (typeof result["error"] != "undefined") {
    res.status(200).json(result);
  } else {
    res.status(200).json({
      deletedDesignation: result,
    });
  }
});

module.exports = router;
