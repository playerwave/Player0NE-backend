require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const cors = require("cors");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//multer setup here
const multer = require("multer");

const auth = require("./middleware/auth");

const app = express();

app.use(express.json());
app.use(cors());

//Login goes here

//Register
app.post("/register", async (req, res) => {
  //register logic here

  try {
    //get user input
    const { email, password } = req.body;

    //validate user input
    if (!email && password) {
      res.status(400).send("All input is required!!!");
    }

    //Check if user is already exist
    //validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User already exist. Please login.");
    }

    //encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    //create user in our database
    const user = await User.create({
      first_name: "",
      last_name: "",
      email,
      password: encryptedPassword,
    });

    //create token
    const token = jwt.sign(
      {
        user_id: user._id,
        email,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    //save user token
    user.token = token;

    //return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});
//End register

//Login
app.post("/login", async (req, res) => {
  //login logic here
  try {
    //get user input
    const { email, password } = req.body;

    //validate user input
    if (!(email && password)) {
      res.status(400).send("all input is required");
    }

    //validate if user exist
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      //Create token
      const token = jwt.sign(
        {
          user_id: user._id,
          email,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      //save user token
      user.token = token;

      res.status(200).json(user);
    }

    res.status(400).send("Invalid Credential");
  } catch (err) {
    console.log(err);
  }
});

//create complete account by add first and lastname
app.patch("/create-complete-account", async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;
    if (!(first_name && last_name)) {
      return res.status(400).send("firstname and lastname is required");
    }

    const thatUser = await User.findOne({ email });
    if (!thatUser) {
      return res.status(404).send("User not found");
    }

    thatUser.first_name = first_name;
    thatUser.last_name = last_name;
    await thatUser.save();
    res.status(200).json(thatUser);
  } catch (err) {
    res.status(500).send("An error occurred");
  }
});



module.exports = app;
