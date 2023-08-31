const jwt = require("express-jwt");
require("dotenv").config();

const secret = process.env.JWT_SECRET;

function getTokenFromHeader(req) {
  if (req.headers?.authorization?.split(" ")[0] === "Token") {
    return req.headers.authorization.split(" ")[1];
  }

  return null;
}

const auth = {
  required: jwt({
    secret: secret,
    userProperty: "payload",
    getToken: getTokenFromHeader,
  }),
  optional: jwt({
    secret: secret,
    userProperty: "payload",
    credentialsRequired: false,
    getToken: getTokenFromHeader,
  }),
};

module.exports = auth;
