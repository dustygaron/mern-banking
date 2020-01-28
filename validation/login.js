// Pull in validator and is-empty dependencies
const Validator = require("validator")
const isEmpty = require("is-empty")

// Export validateLoginInput function - which takes in data as a param (sent from our front end registration form)
module.exports = function validateLoginInput(data) {

  // Instantiate our errors object
  let errors = {}

  // Convert all empty fields to an empty string before running validation checks(validator only works with strings)
  // -- empty fields to empty strings
  data.email = !isEmpty(data.email) ? data.email : ""
  data.password = !isEmpty(data.password) ? data.password : ""

  // Check for empty fields, valid email formats, password requirements and confirm passwrod equality using validator functions
  // -- email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required"
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid"
  }

  // -- password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required"
  }

  // Return our errors object with any and all errors contained as well as an isValid boolean that checks if we have any errors
  return {
    errors,
    isValid: isEmpty(errors)
  }

} // Close export