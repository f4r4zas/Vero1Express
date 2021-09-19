import thunk from 'redux-thunk';
import {createStore, applyMiddleware, compose} from 'redux';
import RootReducer from './reducers/RootReducer';

const initialState = {};

export const Store = createStore(
  RootReducer,
  initialState,
  applyMiddleware(thunk),
);
// export const Store = createStore(
//   RootReducer,
//   initialState,
//   compose(applyMiddleware(...middlewares), devtools)
// );

// export const Store = createStore(
//   RootReducer,
//   initialState,
//   compose(applyMiddleware(...middlewares), devtools)
// );

// export default function configureStore(initialState) {
//   const store = createStore(rootReducer, initialState, applyMiddleware(thunk));
//   return store;
// }
