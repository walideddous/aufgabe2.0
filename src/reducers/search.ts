import { SEARCH_INPUT, searchActions, SearchInput } from "../actions/types";

const initialState: SearchInput = {
  search: "",
};

export default function searchReducer(
  state = initialState,
  action: searchActions
): SearchInput {
  const { type, payload } = action;
  switch (type) {
    case SEARCH_INPUT:
      return {
        ...state,
        search: payload,
      };
    default:
      return state;
  }
}
