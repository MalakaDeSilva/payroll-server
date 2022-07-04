const Employee = require("../model/employee");

function getEmployeeById(id) {
  var query = {
    _id: id,
    isDeleted: false,
  };

  return Employee.find(query)
    .exec()
    .then((doc) => {
      if (doc) {
        return doc;
      } else {
        return { message: "No valid entry found for the provided ID." };
      }
    })
    .catch((err) => {
      return { error: err };
    });
}

function getEmployees() {
  var query = {
    isDeleted: false,
  };

  return Employee.find(query)
    .exec()
    .then((doc) => {
      if (doc) {
        return doc;
      } else {
        return { message: "No valid entries found" };
      }
    })
    .catch((err) => {
      return { error: err };
    });
}

function addEmployee(employee) {
  return employee
    .save()
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return { error: err };
    });
}

function updateEmployee(employee, id) {
  var query = {
    _id: id,
  };

  return Employee.findOneAndUpdate(query, employee, {
    new: true,
  })
    .then((employee) => {
      return employee;
    })
    .catch((err) => {
      return { error: err };
    });
}

function deleteEmployee(employee, id) {
  var query = {
    _id: id,
  };

  return Employee.findOneAndUpdate(query, employee, {
    new: true,
  })
    .then((employee) => {
      return employee;
    })
    .catch((err) => {
      return { error: err };
    });
}

module.exports = {
  getEmployeeById,
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};
