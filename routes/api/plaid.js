// Pull in packages
const express = require('express')
const plaid = require('plaid')
const router = express.Router()
const passport = require('passport')
const moment = require('moment')
const mongoose = require('mongoose')

// Load account and user models
const Account = require('../../models/Account')
const User = require('../../models/User')

// Initialize Plaid using API keys
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID
const PLAID_SECRET = process.env.PLAID_SECRET
const PLAID_PUBLIC_KEY = process.env.PLAID_PUBLIC_KEY

const client = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments.sandbox,
  { version: '2018-05-22' }
)
var PUBLIC_TOKEN = null
var ACCESS_TOKEN = null
var ITEM_ID = null


// Routes
// --------------
// @route POST api/plaid/accounts/add
// @desc Trades public token for access token and stores credentials in database
// @access Private
// --------------
router.post('/accounts/add', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Parse PUBLIC_TOKEN and other data from request
  PUBLIC_TOKEN = req.body.public_token
  const userId = req.user.id
  const institution = req.body.metadata.institution
  const { name, institution_id } = institution

  // Exchange PUBLIC_TOKEN for an ACCESS_TOKEN. Don't need to save PUBLIC_TOKEN in DB(expires after 30 mins). Will store ACCESS_TOKEN so can get transactions and other account specific data.
  if (PUBLIC_TOKEN) {
    client
      .exchangePublicToken(PUBLIC_TOKEN)
      .then(exchangeResponse => {
        ACCESS_TOKEN = exchangeResponse.access_token
        ITEM_ID = exchangeResponse.item_id

        // Check if account already exists for that specific user using the userId and institutionId
        Account.findOne({
          userId: req.user.id,
          institutionId: institution_id
        })
          .then(account => {
            if (account) {
              console.log('Account already exists')
            } else {
              // If account does not exist, save it to DB
              const newAccount = new Account({
                userId: userId,
                accessToken: ACCESS_TOKEN,
                itemId: ITEM_ID,
                institutionId: institution_id,
                institutionName: name
              })
              newAccount.save().then(account => res.json(account))
            }
          })
          .catch(err => console.log(err)) // Mongo Error
      })
      .catch(err => console.log(err)) // Plaid Error
  }
}
)

// --------------
// @route DELETE api/plaid/accounts/:id
// @desc Delete account with given id
// @access Private
// --------------
router.delete('/accounts/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Account.findById(req.params.id).then(account => {
    // Delete account
    account.remove().then(() => res.json({ success: true }))
  })
})

// --------------
// @route GET api/plaid/accounts
// @desc Get all accounts linked with plaid for a specific user
// @access Private
// --------------
router.get('/accounts', passport.authenticate('jwt', { session: false }), (req, res) => {
  Account.find({ userId: req.user.id })
    .then(accounts => res.json(accounts))
    .catch(err => console.log(err))
}
)

// --------------
// @route POST api/plaid/accounts/transactions
// @desc Fetch transactions from past 30 days from all linked accounts
// @access Private
// --------------
router.post('/accounts/transactions', passport.authenticate('jwt', { session: false }), (req, res) => {

  // For each account a user has linked, use that account’s ACCESS_TOKEN to getTransactions from the past 30 days
  const now = moment()
  const today = now.format('YYYY-MM-DD')
  const thirtyDaysAgo = now.subtract(30, 'days').format('YYYY-MM-DD')

  // Change this if you want more transactions
  let transactions = []
  const accounts = req.body

  if (accounts) {
    accounts.forEach(function (account) {
      ACCESS_TOKEN = account.accessToken
      const institutionName = account.institutionName
      client
        .getTransactions(ACCESS_TOKEN, thirtyDaysAgo, today)
        .then(response => {
          // Push object onto an array containing the institutionName and all transactions
          transactions.push({
            accountName: institutionName,
            transactions: response.transactions
          })
          // Don't send back response till all transactions have been added
          if (transactions.length === accounts.length) {
            res.json(transactions)
          }
        })
        .catch(err => console.log(err))
    })
  }
}
)

// Export router
module.exports = router