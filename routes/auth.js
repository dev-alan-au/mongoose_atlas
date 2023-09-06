const express = require("express");
const router = express.Router();
const JSONWebToken = require("jsonwebtoken");

const { expressjwt: jwt } = require("express-jwt");
require("dotenv").config();

const User = require("../models/User");

const secret = process.env.JWT_SECRET;

// function getTokenFromHeader(req) {
//   if (req.headers?.authorization?.split(" ")[0] === "Token") {
//     return req.headers.authorization.split(" ")[1];
//   }

//   return null;
// }

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
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).send({
      message: "Email and password required.",
    });
  }

  const user = await User.findOne({ email }).exec();

  if (user === null) {
    return res.status(400).send({
      message: "User not found.",
    });
  }

  if (user.validatePassword(password)) {
    const { username, email } = user;
    const token = JSONWebToken.sign({ username, email }, secret);

    return res.status(201).json({
      success: true,
      token,
    });
  }

  return res.status(400).send({
    success: false,
    message: "Wrong Password.",
  });
});

router.get("/profile", (req, res) => {
  if (!req.user) {
    return res.status(401).send({
      message: "Not authorised.",
    });
  }

  return res.status(200).send();
});

module.exports = router;
