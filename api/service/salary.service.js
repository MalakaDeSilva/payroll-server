const puppeteer = require("puppeteer");
const fs = require("fs");
const pdf = require("html-pdf");
const path = require("path");

const Salary = require("../model/salary");
const employeeService = require("./employee.service");
const addOnsService = require("./add.ons.service");
const fixedCommissionsService = require("./fixed.commission.service");
const perUnitCommissionsService = require("./per.unit.commission.service");
const designationService = require("./designation.service");
const Util = require("../util/metadata.helper");

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

async function generatePDF(id) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:8080/salary/slip/get/" + id, {
    waitUntil: "networkidle0",
  });
  const pdf = await page.pdf({ format: "A4" });

  await browser.close();
  return pdf;
}

async function _generatePdf(id, callback) {
  let file = fs.readFileSync(
    path.resolve(__dirname, "../assets/_template.html"),
    "utf8"
  );
  let options = { format: "Letter" };

  let salary = await getSalaries({ _id: id });
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

  pdf.create(file, options).toBuffer(function (err, buffer) {
    if (err) console.log(err);

    callback(buffer);
  });
  /* .then((buffer) => {
      return buffer;
    })
    .catch((err) => {
      return err;
    }); */
}

module.exports = {
  getSalaries,
  saveSalary,
  updateSalary,
  deleteSalary,
  getSalaryData,
  calculateSalary,
  generatePDF,
  _generatePdf,
};
