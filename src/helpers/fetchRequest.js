import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://ecoplastic.herokuapp.com/api/v1",
});

export const setRequestToken = (token) =>
  (axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + token);

export const removeRequestToken = () =>
  (axiosInstance.defaults.headers.common["Authorization"] = null);

export const fetchRequest = (endpoint = "", method = "GET", data = {}) => {
  let config = {};

  if (method === "GET") {
    config = { url: endpoint, method };
  } else {
    config = {
      url: endpoint,
      method,
      data,
    };
  }

  return axiosInstance(config);
};
