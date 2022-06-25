const AddOns = require("../model/add.ons");

function getAddOnsByEmployeeId(employeeId) {
  let query = {
    employeeId,
  };

  return AddOns.find(query)
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

function getAddOnsByPayCycle(payCycle) {
  let query = {
    fromPayCycle: payCycle,
  };

  console.log(query);
  return AddOns.find(query)
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

function getAddOnsByEmployeeIdPayCycle(employeeId, fromPayCycle) {
  let query = {
    employeeId,
    fromPayCycle,
  };

  return AddOns.find(query)
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

function getAddOns() {
  return AddOns.find()
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

function createUpdateAddOns(addOn, employeeId) {
  var query = { employeeId },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

  return AddOns.findOneAndUpdate(query, addOn, options)
    .then((doc) => {
      if (doc) {
        return { updatedAddOn: doc };
      } else {
        addOn.set({
          _id: new mongoose.Types.ObjectId(),
        });

        return addOn
          .save()
          .then((result) => {
            return { createdAddOn: result };
          })
          .catch((err) => {
            return { error: err };
          });
      }
    })
    .catch((err) => {
      return { error: err };
    });
}

function createAddOn(addOn) {
  return addOn
    .save()
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return { error: err };
    });
}

function updateAddOns(addOn, id) {
  let query = {
    _id: id,
  };

  return AddOns.findOneAndUpdate(query, addOn)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return { error: err };
    });
}

function deleteAddOns(addOn, id) {
  let query = {
    _id: id,
  };

  return AddOns.findOneAndUpdate(query, addOn)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return { error: err };
    });
}

module.exports = {
  getAddOnsByEmployeeId,
  getAddOnsByEmployeeIdPayCycle,
  getAddOnsByPayCycle,
  getAddOns,
  createUpdateAddOns,
  createAddOn,
  updateAddOns,
  deleteAddOns,
};
