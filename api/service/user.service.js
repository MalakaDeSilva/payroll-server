const User = require("../model/user");

function getUserByEmail(email) {
  let query = {
    email,
    isResigned: false,
  };

  return User.find(query)
    .exec()
    .then((doc) => {
      if (doc) {
        return doc;
      } else {
        return "Invalid email.";
      }
    })
    .catch((err) => {
      return { error: err };
    });
}

function addUser(user) {
  return user
    .save()
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return { error: err };
    });
}

function updatePassword(user, email) {
  let query = {
    email: email,
    isResigned: false,
  };

  return User.findOneAndUpdate(query, user, {
    new: true,
  })
    .then((doc) => {
      return doc;
    })
    .catch((err) => {
      return { error: err };
    });
}

function markAsResigned(email) {
  let _user = new User({
    isResigned: true,
  });

  let query = {
    isResigned: false,
    email: email,
  };

  return User.findOneAndUpdate(query, _user, {
    new: true,
  })
    .then((doc) => {
      return doc;
    })
    .catch((err) => {
      return { error: err };
    });
}

module.exports = {
  getUserByEmail,
  addUser,
  updatePassword,
  markAsResigned,
};
