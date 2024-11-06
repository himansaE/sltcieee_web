import axios from "axios";
import { BACKEND_BASE_URL } from "./envs";

const Request = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default Request;
