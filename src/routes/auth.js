const express = require("express");
const router = express.Router();

const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const bcryptSalt     = 10;


router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
    // res.send("auth/signup");
});

router.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    // const salt     = bcryptjs.genSaltSync(bcryptSalt);
    // const hashPass = bcryptjs.hashSync(password, salt);
  
    if (username === "" || password === "") {
        res.render("auth/signup", {
          errorMessage: "Indicate a username and a password to sign up"
        });
        return;
      }
  
      User.findOne({ "username": username })
      .then(user => {
        if (user !== null) {
            res.render("auth/signup", {
              errorMessage: "The username already exists!"
            });
            return;
          }
      
          const salt     = bcryptjs.genSaltSync(bcryptSalt);
          const hashPass = bcryptjs.hashSync(password, salt);
      
          User.create({
            username,
            password: hashPass
          })
          .then(() => {
            res.redirect("/");
          })
          .catch(error => {
            console.log(error);
          })
      })
      .catch(error => {
        next(error);
      })
  
    
  });
  

module.exports = router;