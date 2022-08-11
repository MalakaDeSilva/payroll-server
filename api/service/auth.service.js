const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userService = require("../service/user.service");

async function login(email, password) {
  try {
    let token = null;
    let user = null;
    if (email && password) {
      user = await userService.getUserByEmail(email);
      if (user.length !== 0) {
        let match = await bcrypt.compare(password, user[0].password);
        if (email === user[0].email && match) {
          token = await jwt.sign(
            { email: email, role: user[0].role },
            process.env.privateKey,
            {
              expiresIn: "1h",
            }
          );
        }
      } else {
        return { error: "Invalid email address." };
      }
    }
    if (token) {
      return { token: token, user: user };
    } else {
      return { error: "Email/Password is incorrect." };
    }
  } catch (err) {
    return { error: err };
  }
}

function verifyToken(req, res, next) {
  req.user = { email: null, verified: false };
  const { privateKey } = process.env;
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    jwt.verify(bearerToken, privateKey, function (err, data) {
      if (!(err && typeof data === "undefined")) {
        req.user = { email: data.email, role: data.role, verified: true };
        next();
      } else {
        return res.sendStatus(403);
      }
    });
  } else {
    return res.sendStatus(403);
  }
}

function checkTokenValidity(token) {
  const { privateKey } = process.env;

  try {
    let result = jwt.verify(token, privateKey);
    return { verified: true, result };
  } catch (e) {
    return { verified: false, error: e };
  }
}

function logout(bearerHeader) {
  //const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    //add bearerToken to blacklist
  }
}

module.exports = {
  login,
  logout,
  verifyToken,
  checkTokenValidity,
};
