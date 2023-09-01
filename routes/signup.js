const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/signup", async (req, res) => {
  const { username, email, password } = req?.body ?? {};
  if(!(username && email && password)) {
    return res.status(500).send({
      message: "Username, email and password are required",
    });
  }
  
  let user;

  try {
    user = new User({
      email,
      username
    });
  } catch(ex) {
    console.error(ex);
    let message = "User could not be created";
    if(ex.errors?.username?.properties?.type == 'unique') {
      message = "Username is already taken";
    } else if (ex.errors?.email?.properties?.type == 'unique') {
      message = "Email is already taken";
    }

    return res.status(500).send({ message });
  }

  //!! check if this is working
  if(user) {
    try {
      user.setPassword(password);
    } catch(ex) {
      console.error(ex);
      return res.status(500).send({
        message: "Something went wrong.",
      });
    }
    await user.save();
  }

  return res.status(200).send(`A new user ${ username } create`)
});

module.exports = router;
