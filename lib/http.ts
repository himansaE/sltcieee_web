import axios from "axios";
import { ClientEnv } from "./env/client";

const Request = axios.create({
  baseURL: ClientEnv.BACKEND.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default Request;
