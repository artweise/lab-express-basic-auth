const router = require("Express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const saltRound = 10;

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

// need to refactor, but it works for now OK
/* const passwordValidation = ((password)=>{
    if (password >= 8){
        return validResult = 'true'
    }
    else {
        return validResult = "Your password is too short"
    }
}) */

router.post("/signup", (req, res) => {
  const { username, password: myPlaintextPassword } = req.body; // the data which user type in the form
  // rename field password to myPlaintextPassword using dectructuring
  User.findOne({ username }).then((data) => {
    if (data) {
      console.log("USER EXIST");
      res.redirect("/user-exist");
      //   res.send("User exist! Try another username");
    } else {
      if (myPlaintextPassword.length >= 8) {
        bcrypt
          .genSalt(saltRound)
          .then((salt) => {
            return bcrypt.hash(myPlaintextPassword, salt);
          })
          .then((hashedPassword) => {
            return User.create({
              username: username,
              passwordHash: hashedPassword,
            });
          })
          .then(() => {
            res.redirect("/profile");
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        res.send("Your password is too short");
      }
    }
  });
});

router.get("/profile", (req, res) => {
  res.render("user/user-profile");
});

router.get("/user-exist", (req, res) => {
  res.render("user/user-exist");
});

module.exports = router;
