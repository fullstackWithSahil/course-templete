import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api` || "http://localhost:8080/api",
});

export default API;