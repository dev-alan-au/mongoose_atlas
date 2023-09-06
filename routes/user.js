const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/signup", async (req, res) => {
  const { username, email, password } = req?.body ?? {};
  if (!(username && email && password)) {
    return res.status(500).send({
      message: "Username, email and password are required",
    });
  }

  let user;

  try {
    user = new User({
      email,
      username,
    });
  } catch (ex) {
    console.error(ex);
    let message = "User could not be created";
    if (ex.errors?.username?.properties?.type == "unique") {
      message = "Username is already taken";
    } else if (ex.errors?.email?.properties?.type == "unique") {
      message = "Email is already taken";
    }

    return res.status(500).send({ message });
  }

  //!! check if this is working
  if (user) {
    try {
      user.setPassword(password);
      await user.save();
    } catch (ex) {
      console.error(ex);
      return res.status(500).send({
        message: "Something went wrong.",
      });
    }
  }

  return res.status(200).send(`A new user ${username} create`);
});

// TODO: Need to move to email URL
router.patch("/update-password", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!password) {
    return res.status(400).send({
      message: "Password cannot be empty.",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send({
      message: "User not found.",
    });
  }

  try {
    user.setPassword(password);
    user.save();
  } catch (ex) {
    console.error(ex);
    return res.status(500).send({
      message: "Password could not be updated.",
    });
  }

  return res.status(200).send(`Password updated.`);
});

module.exports = router;
