const Salary = require("../model/salary");

const employeeService = require("./employee.service");
const addOnsService = require("./add.ons.service");
const fixedCommissionsService = require("./fixed.commission.service");
const perUnitCommissionsService = require("./per.unit.commission.service");

function getSalaries(query) {
  query = {
    ...query,
    isDeleted: false,
  };

  return Salary.find(query)
    .exec()
    .then((doc) => {
      if (doc) {
        return doc;
      } else {
        return { message: "No entries found." };
      }
    })
    .catch((err) => {
      return { error: err };
    });
}

function saveSalary(salary) {
  return salary
    .save()
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return { error: err };
    });
}

function updateSalary(salary, id) {
  let query = {
    _id: id,
    isDeleted: false,
  };

  return Salary.findOneAndUpdate(query, salary, {
    new: true,
  })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return { error: err };
    });
}

function deleteSalary(salary, id) {
  let query = {
    _id: id,
  };

  return Salary.findOneAndUpdate(query, salary, {
    new: true,
  })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return { error: err };
    });
}

async function getSalaryData(metadata) {
  let salaryData = {
    basic: 0,
    increment: 0,
    fixedAllowance: 0,
    fixedCommissions: [],
    perUnitCommissions: [],
  };

  let result = {};

  // get basic salary
  result = await employeeService.getEmployeeByEmployeeId(metadata.empId);
  salaryData["basic"] = result[0]["salary"];

  // get increments and allowance
  result = await addOnsService.getAddOnsByEmployeeIdPayCycle(
    metadata.empId,
    metadata.payCycle
  );

  salaryData["increment"] =
    typeof result[0] == "undefined" ? 0 : result[0]["increment"];
  salaryData["fixedAllowance"] =
    typeof result[0] == "undefined" ? 0 : result[0]["fixedAllowance"];

  // get fixed commissions
  result = await fixedCommissionsService.getCommissionByEmployeePayCycle(
    metadata.empId,
    metadata.payCycle
  );

  salaryData["fixedCommissions"] = result.map((item) => {
    return {
      _id: item._id,
      commissionName: item.commissionName,
      commission: item.amount,
    };
  });

  // get per unit commissions
  result = await perUnitCommissionsService.getCommissionByEmployeePayCycle(
    metadata.empId,
    metadata.payCycle
  );

  salaryData["perUnitCommissions"] = result.map((item) => {
    return {
      _id: item._id,
      commissionName: item.commissionName,
      commission: item.amount,
      units: item.units,
      totalCommission: item.units * item.amount,
    };
  });

  return salaryData;
}

function calculateSalary(salaryData) {
  let totalSalary = 0;

  totalSalary += salaryData["basic"]; //basic
  totalSalary += salaryData["fixedAllowance"]; //fixedAllowance
  totalSalary += salaryData["increment"]; //increment
  totalSalary += salaryData["bonus"]; //bonus

  salaryData["fixedCommissions"].forEach((ele) => {
    totalSalary += ele["commission"];
  });

  salaryData["perUnitCommissions"].forEach((ele) => {
    totalSalary += ele["commission"] * ele["units"];
  });

  totalSalary -= salaryData["reductions"]; //reductions

  return {
    grossSalary: totalSalary,
    netSalary: totalSalary,
  };
}

module.exports = {
  getSalaries,
  saveSalary,
  updateSalary,
  deleteSalary,
  getSalaryData,
  calculateSalary,
};
