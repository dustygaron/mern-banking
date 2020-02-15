// Pull in required dependencies
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
require('dotenv').config()
const path = require('path')

// Pull in routes
const users = require('./routes/api/users')
const plaid = require('./routes/api/plaid')

// Initalize app using express()
const app = express()

// Apply middleware func for bodyparser so we can use it
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
app.use(bodyParser.json())

// Pull in MongoURI from keys.js & connect to DB
const db = require('./config/keys').mongoURI

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log(`💸 💸 💸 Success! MongoDB connected...`))
  .catch(err => console.log(err))

// Passport middleware
app.use(passport.initialize())

// Passport config
require('./config/passport')(passport)

// Routes
app.use('/api/users', users)
app.use('/api/plaid', plaid)

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

// Set PORT for server to run on & app to listen on
const port = process.env.PORT || 5000;
// process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`🏃 🏃 🏃 Server running on PORT ${port}`))