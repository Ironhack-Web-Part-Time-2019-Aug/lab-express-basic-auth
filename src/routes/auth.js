const express = require("express");
const router = express.Router();

const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const bcryptSalt     = 10;


router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
    // res.send("auth/signup");
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
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
            res.render("auth/login", {
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


  router.post("/login", (req, res, next) => {
    const theUsername = req.body.username;
    const thePassword = req.body.password;
  
    if (theUsername === "" || thePassword === "") {
      res.render("auth/login", {
        errorMessage: "Please enter both, username and password to sign up."
      });
      return;
    }
  
    User.findOne({ "username": theUsername })
    .then(user => {
        if (!user) {
          res.render("auth/login", {
            errorMessage: "The username doesn't exist."
          });
          return;
        }
        if (bcryptjs.compareSync(thePassword, user.password)) {
          // Save the login in the session!
          req.session.currentUser = user;
          res.redirect("/");
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
    })
    .catch(error => {
      next(error);
    })
  });

  router.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
      // cannot access session here
      res.redirect("/login");
    });
  });
  

module.exports = router;