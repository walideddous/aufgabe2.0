import axios from "axios";
import {
    GRAPHQL_API,
    GET_STOPS_BY_MODES,
  } from "../config/config";


  const authAxios = axios.create({
    baseURL: GRAPHQL_API,
    headers: {
      authorization: "Bearer " + process.env.REACT_APP_JSON_SECRET_KEY,
    },
  });

export default async (modes:any )=> {
    const response = await authAxios.post("/graphql", {
        query: GET_STOPS_BY_MODES(modes),
      });
      return response
}