// Import actions from types.js
import {
  SET_CURRENT_USER,
  USER_LOADING
} from '../actions/types'

const isEmpty = require('is-empty')

// Define initial state
const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false
}

// Define how state should change based on actions with a switch statement
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      }
    case USER_LOADING:
      return {
        ...state,
        loading: true
      }
    default:
      return state
  }
}