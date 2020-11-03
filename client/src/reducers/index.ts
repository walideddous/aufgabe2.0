import { combineReducers } from "redux";
import searchReducer from "./search";
import getDataReducer from "./getData";

export default combineReducers({ searchReducer, getDataReducer });
