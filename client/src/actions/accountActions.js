import axios from 'axios'

import {
  ADD_ACCOUNT,
  DELETE_ACCOUNT,
  GET_ACCOUNTS,
  ACCOUNTS_LOADING,
  GET_TRANSACTIONS,
  TRANSACTIONS_LOADING
} from './types'

// Actions
// Parse accounts from request and send it to /accounts/add endpoint
// Concatenate the new account to our current accounts array and call getTransactions on the new accounts array

// Add Account
export const addAccount = plaidData => dispatch => {
  const accounts = plaidData.accounts
  axios
    .post('/api/plaid/accounts/add', plaidData)
    .then(res =>
      dispatch({
        type: ADD_ACCOUNT,
        payload: res.data
      })
    )
    .then(data =>
      accounts ? dispatch(getTransactions(accounts.concat(data.payload))) : null
    )
    .catch(err => console.log(err))
}


// Delete account
// Filter out the deleted account from the accounts array before calling getTransactions
export const deleteAccount = plaidData => dispatch => {
  if (window.confirm('Are you sure you want to remove this account?')) {
    const id = plaidData.id
    const newAccounts = plaidData.accounts.filter(
      account => account._id !== id
    )
    axios
      .delete(`/api/plaid/accounts/${id}`)
      .then(res =>
        dispatch({
          type: DELETE_ACCOUNT,
          payload: id
        })
      )
      .then(newAccounts ? dispatch(getTransactions(newAccounts)) : null)
      .catch(err => console.log(err))
  }
}

// Get Accounts
// Get all accounts for specific user
export const getAccounts = () => dispatch => {
  dispatch(setAccountsLoading())
  axios
    .get('/api/plaid/accounts')
    .then(res =>
      dispatch({
        type: GET_ACCOUNTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ACCOUNTS,
        payload: null
      })
    )
}
// Accounts loading
export const setAccountsLoading = () => {
  return {
    type: ACCOUNTS_LOADING
  }
}

// Get Transactions
export const getTransactions = plaidData => dispatch => {
  dispatch(setTransactionsLoading())
  axios
    .post('/api/plaid/accounts/transactions', plaidData)
    .then(res =>
      dispatch({
        type: GET_TRANSACTIONS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_TRANSACTIONS,
        payload: null
      })
    )
}
// Transactions loading
export const setTransactionsLoading = () => {
  return {
    type: TRANSACTIONS_LOADING
  }
}