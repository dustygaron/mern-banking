import { combineReducers } from 'redux'
import authReducer from './authReducer'
import errorReducer from './errorReducer'

// Use combinedReducers from redux to combine authReducer and errorReducer into one rootReducer.
export default combineReducers({
  auth: authReducer,
  errors: errorReducer
})