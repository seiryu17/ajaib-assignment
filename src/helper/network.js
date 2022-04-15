import axios from "axios";
import { errorHandler } from "./errorHandler";

const axiosInstance = axios.create({
  baseURL: "https://randomuser.me",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const getData = async (path) => {
  try {
    const response = await axiosInstance.get(path);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    if (error.response) {
      return errorHandler(error);
    } else if (error.request) {
      return errorHandler({
        response: {
          status: 503,
        },
      });
    }
  }
};

export { getData as get };
