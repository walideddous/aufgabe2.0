import axios from "axios";
import {  GET_STOP_SEQUENCE_BY_MODES } from "../config/config";

const authAxios = axios.create({
  baseURL: "http://ems-dev.m.mdv:8101",
  headers: {
    authorization: "Bearer " + process.env.REACT_APP_JSON_SECRET_KEY,
  },
});
const queryStopSequenceRequest = async (modes: string) => {
  const response = await authAxios.post("/graphql", {
    query: GET_STOP_SEQUENCE_BY_MODES(modes),
  });
  return response;
};
const saveStopSequenceRequest = async (body: any) => {
  const response = await authAxios.put("/savedStopSequence", body);
  return response;
};
const deleteStopSequenceRequest = async (id: string) => {
  const response = await authAxios.delete(`/savedStopSequence/${id}`);
  return response;
};

export { queryStopSequenceRequest, saveStopSequenceRequest, deleteStopSequenceRequest };
