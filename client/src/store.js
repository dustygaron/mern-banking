import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducers'

const initialState = {}
const middleware = [thunk]

// createStore() creates a Redux store that holds the complete state tree of your app. There should only be a single store in your app.
// const store = createStore(rootReducer, initialState, compose(
//   applyMiddleware(...middleware),
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// )
// )

const composeEnhancers =
  typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose

const enhancer = composeEnhancers(
  applyMiddleware(...middleware),
  // other store enhancers if any
)
const store = createStore(reducer, enhancer)

export default store