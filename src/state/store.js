import { applyMiddleware, createStore, compose } from "redux";
import reducers from "./reducers";
import thunk from "redux-thunk";

// const saveToLocalStorage = (state) => {
//   const serializedState = JSON.stringify(state);
//   localStorage.setItem("state", serializedState);
// };

// const loadFromLocalStorage = () => {
//   const serializedState = localStorage.getItem("state");
//   if (serializedState === null) return undefined;
//   return JSON.parse(serializedState);
// };

// const presistedState = loadFromLocalStorage();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(thunk))
);
// store.subscribe(() => saveToLocalStorage(store.getState()));
