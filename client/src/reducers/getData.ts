import {
  GET_SUCCESS,
  SELECT_BUTTON,
  getDataActions,
  selectButtonActions,
  LoadingType,
} from "../actions/types";

const initialState: LoadingType = {
  loading: true,
  selected: {},
  //data: data(),
};

export default function getDataReducer(
  state = initialState,
  action: getDataActions | selectButtonActions
): LoadingType {
  const { type, payload } = action;
  switch (type) {
    case GET_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case SELECT_BUTTON:
      return {
        ...state,
        loading: false,
        selected: payload,
      };
    default:
      return state;
  }
}
