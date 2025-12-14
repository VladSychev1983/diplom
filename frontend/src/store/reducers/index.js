import { combineReducers } from 'redux';
import counterReducer from './counterReducer';
import { userReducer } from './userReducer';

const rootReducer = combineReducers({
  counter: counterReducer, // The 'counter' key will be the state's key
  user: userReducer.reducer,      // Save an authentificated user data state. 
});

export default rootReducer;