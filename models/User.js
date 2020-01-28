// Pull in required dependencies
const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Create schema to represent a user, defining fields & types as objects of the schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

// Export the model so we can access outside of this file
module.exports = User = mongoose.model("users", UserSchema)