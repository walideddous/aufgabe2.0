import axios from "axios";
import {GRAPHQL_API,  GET_STOP_SEQUENCE_BY_MODES, SAVE_STOP_SEQUENCE_BY_MODES, DELETE_STOP_SEQUENCE_BY_MODES } from "../config/config";

const authAxios = axios.create({
  baseURL: GRAPHQL_API,
});
const queryStopSequenceRequest = async (modes: string[]) => {
  const response = await authAxios.post("/graphql", {
    query: GET_STOP_SEQUENCE_BY_MODES(modes),
  });
  return response;
};
const saveStopSequenceRequest = async (body: any) => {
  const response = await authAxios.post("/graphql", {
    query: SAVE_STOP_SEQUENCE_BY_MODES(body),
  });
  return response;
};
const deleteStopSequenceRequest = async (id: string) => {
  const response = await authAxios.post("/graphql", {
    query: DELETE_STOP_SEQUENCE_BY_MODES(id),
  });
  return response;
};

export { queryStopSequenceRequest, saveStopSequenceRequest, deleteStopSequenceRequest };
