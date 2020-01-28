// Pull in required dependencies
const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const keys = require("../../config/keys")

// Load input validation
const validateRegisterInput = require("../../validation/register")
const validateLoginInput = require("../../validation/login")

// Load User model
const User = require("../../models/User")

// Register endpoint
// -----------------
// @route POST api/users/register
// @desc Register user
// @access Public
// -----------------
router.post("/register", (req, res) => {
  // Pull errors and isValid variables from validateRegisterInput(req.body) func and check input validation
  const { errors, isValid } = validateRegisterInput(req.body)

  // If not valid
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // If valid input, use MongoDB's User.findOne() to see if they user already exists
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      // If user is new user, fill in the fields (name, email, password) with data sent in the body of the request
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      })

      // Use bcrypt to hash the password before storing it in DB
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          newUser.password = hash
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err))
        })
      })
    }
  })
})


// Login endpoint
// -----------------
// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
// -----------------
router.post("/login", (req, res) => {
  // Pull the errors and isValid variables from validateLoginInput(req.body) func and check input validation
  const { errors, isValid } = validateLoginInput(req.body)

  if (!isValid) {
    return res.status(400).json(errors)
  }

  const email = req.body.email
  const password = req.body.password

  // If valid, use MongoDB's User.findOne() to see if user exists
  User.findOne({ email }).then(user => {

    // If does not exist
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" })
    }

    // If does exist, use bcryptjs to compare submitted password with hashed password in DB
    bcrypt.compare(password, user.password).then(isMatch => {

      if (isMatch) {
        // If passwords match, create JWT Payload
        const payload = {
          id: user.id,
          name: user.name
        }

        // Sign our jwt, including payload, keys.secretOrKey from keys.js and set an expiresIn time(in seconds)
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },

          // If successful, append the token to a Bearer string(ex: in passport.js opts.jwtFromRequest = ExtractJwt.dromAuthHeaderAsBearerToken())
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            })
          }
        )
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" })
      }
    })
  })
})


// Export router
module.exports = router


