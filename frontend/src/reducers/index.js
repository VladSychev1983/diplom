import { combineReducers } from 'redux';
import counterReducer from './counterReducer';
import todosReducer from './todosReducer';
//import { counterSlice } from './counterSlice';

const indexSlice = combineReducers({
  counter: counterReducer, // The 'counter' key will be the state's key
  todos: todosReducer,      // The 'todos' key will be the state's key

});

export default indexSlice;