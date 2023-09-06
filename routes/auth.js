const express = require("express");
const router = express.Router();

const { expressjwt: jwt } = require("express-jwt");
require("dotenv").config();

const User = require("../models/User");

const secret = process.env.JWT_SECRET;

function getTokenFromHeader(req) {
  if (req.headers?.authorization?.split(" ")[0] === "Token") {
    return req.headers.authorization.split(" ")[1];
  }

  return null;
}

// const auth = {
//   required: jwt({
//     secret: secret,
//     userProperty: "payload",
//     getToken: getTokenFromHeader,
//     algorithms: [],
//   }),
//   optional: jwt({
//     secret: secret,
//     userProperty: "payload",
//     credentialsRequired: false,
//     getToken: getTokenFromHeader,
//   }),
// };

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).exec();

  if (user === null) {
    return res.status(400).send({
      message: "User not found.",
    });
  }
  if (user.validatePassword(req.body.password)) {
    return res.status(201).send({
      message: "User Logged In",
    });
  }
  return res.status(400).send({
    message: "Wrong Password",
  });
});

module.exports = router;
