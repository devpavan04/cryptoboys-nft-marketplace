import { combineReducers } from "redux";
import userReducer from "./userReducer";

const reducers = combineReducers({
  user : userReducer,
});

export default reducers;
