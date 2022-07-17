const Commission = require("../model/fixed.commission");

function getCommissions(query) {
  query = {
    ...query,
    isDeleted: false,
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

  return Commission.findOneAndUpdate(query, commission, {
    new: true,
  })
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

  return Commission.findOneAndUpdate(query, commission, {
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
  getCommissions,
  addCommission,
  updateCommission,
  deleteCommission,
};
