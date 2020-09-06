import { SEARCH_INPUT, searchActions } from "./types";

export function searchData(search: string): searchActions {
  return {
    type: SEARCH_INPUT,
    payload: search,
  };
}
