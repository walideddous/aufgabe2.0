import {
  GET_SUCCESS,
  SELECT_BUTTON,
  getDataActions,
  selectButtonActions,
} from "./types";
import { data } from "../data/data";
/*
export function getData(): getDataActions {
  return {
    type: GET_SUCCESS,

  };
}
*/

export function selectButton(el: Object): selectButtonActions {
  return {
    type: SELECT_BUTTON,
    payload: el,
  };
}
