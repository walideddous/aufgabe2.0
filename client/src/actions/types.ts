export const GET_SUCCESS = "GET_SUCCESS";
export const SELECT_BUTTON = "SELECT_BUTTON";
export const SEARCH_INPUT = "SEARCH_INPUT";

// Declare the Type of Actions functions
export interface getDataActions {
  type: typeof GET_SUCCESS;
  payload: {
    id: string;
    name: string;
    adresse: string;
    Umstiegmöglischkeiten: string;
  }[];
}

export interface selectButtonActions {
  type: typeof SELECT_BUTTON;
  payload: Object;
}

export interface searchActions {
  type: typeof SEARCH_INPUT;
  payload: string;
}

// Declare type of initialeState
export interface SearchInput {
  search: string;
}

export interface LoadingType {
  loading: boolean;
  selected: any;
  data: {
    id: string;
    name: string;
    adresse: string;
    location: {
      lat: number | string;
      lng: number | string;
    };
    Umstiegmöglischkeiten: string;
  }[];
}
