import axios from "axios";
import {
    GRAPHQL_API,
    GET_STOP_SEQUENCE_BY_MODES,
  } from "../config/config";


  const authAxios = axios.create({
    baseURL: GRAPHQL_API,
    headers: {
      authorization: "Bearer " + process.env.REACT_APP_JSON_SECRET_KEY,
    },
  });

export const queryStopSequence = async (modes:any )=> {
    const response = await authAxios.post("/graphql", {
        query: GET_STOP_SEQUENCE_BY_MODES(modes),
      });
      return response
}

export const createStopSequence = async (body:any )=> {
    const response = await authAxios.put("/savedStopSequence", body)
      return response
}

export const deleteStopSequence = async (id:any )=> {
    const response = await authAxios.delete(`/savedStopSequence/${id}`)
      return response
}