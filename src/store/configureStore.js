import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import authReducer from '../reducers/auth';

export default () => {
  const reducer = combineReducers({
    auth: authReducer
  });

  // Use compose if DEVTOOLS extension does not exist
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  // Use composeEnhancer to combine using Redux devtools with
  // Redux thunk (for connecting Redux store with Firebase database)
  // and asynchronous actions
  const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));
  return store;
};
