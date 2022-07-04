const Designation = require("../model/designation");

function getDesignationByCode(desgCode) {
  let query = {
    designationCode: desgCode,
  };

  return Designation.find(query)
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

function getDesignations() {
  return Designation.find()
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

function addDesignation(designation) {
  return designation
    .save()
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return { error: err };
    });
}

function updateDesignation(designation, id) {
  var query = {
    _id: id,
  };

  return Designation.findOneAndUpdate(query, designation, {
    new: true,
  })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return { error: err };
    });
}

function deleteDesignation(designation, id) {
  var query = {
    _id: id,
  };

  return Designation.findOneAndUpdate(query, designation, {
    new: true,
  })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return { error: err };
    });
}

module.exports = {
  getDesignationByCode,
  getDesignations,
  addDesignation,
  updateDesignation,
  deleteDesignation,
};
