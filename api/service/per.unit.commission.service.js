const Commission = require("../model/per.unit.commission");

function getCommissionByEmployeePayCycle(employeeId, payCycle) {
  let query = {
    employeeId,
    payCycle,
  };

  return Commission.find(query)
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

function getCommissionsByPayCyle(payCylce) {
  let query = {
    payCylce,
  };

  return Commission.find(query)
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

function addCommission(commission) {
  return commission
    .save()
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return { error: err };
    });
}

function updateCommission(commission, id) {
  let query = {
    _id: id,
  };

  return Commission.findOneAndUpdate(query, commission)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return { error: err };
    });
}

function deleteCommission(commission, id) {
  let query = {
    _id: id,
  };

  return Commission.findOneAndUpdate(query, commission)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return { error: err };
    });
}

module.exports = {
  getCommissionByEmployeePayCycle,
  getCommissionsByPayCyle,
  addCommission,
  updateCommission,
  deleteCommission
};
