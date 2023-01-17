const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const saltRounds = 10;

// GET route ==> to display the signup form to users
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// POST route ==> to process form data

router.post("/signup", (req, res, next) => {
  //req.body what a user has submitted
  console.log("Data from user: ", req.body);
  const { username, password } = req.body;
  // checking if all required fields are provided
  if (!username || !password) {
    return res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username and password.",
    });
  }

  // Validation of the username with regex
  // Username may include _ and – having a length of 3 to 16 characters
  const regexUsername = /^[a-z0-9_-]{3,16}$/;
  if (!regexUsername.test(username)) {
    return res.render("auth/signup", {
      errorMessage:
        "Please enter a username with a length of 3 to 16 characters. It may include '_'",
    });
  }

  bcrypt
    .hash(password, saltRounds)
    // another approach
    // at first generate the salt number, then to put salt number and bcrypted password together
    /* bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      return bcrypt.hash(password, salt);
    }) */
    .then((hashedPassword) => {
      console.log("HashedPassword: ", hashedPassword);
      return User.create({
        username: username,
        // passwordHash => this is the key from the User model
        // hashedPassword => this is placeholder (how we named returning value from the previous method .hash()
        passwordHash: hashedPassword,
      });
    })
    .then((newUserCreatedInDB) => {
      //   console.log("New created user is: ", newUserCreatedInDB);
      res.redirect("/profile");
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

router.get("/profile", (req, res, next) => res.render("user/user-profile.hbs"));

module.exports = router;
