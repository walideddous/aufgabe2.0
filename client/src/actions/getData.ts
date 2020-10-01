import { SELECT_BUTTON, selectButtonActions } from "./types";
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
