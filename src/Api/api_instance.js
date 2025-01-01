import axios from "axios";

const api = axios.create({
  baseURL: "https://codeground-be.vercel.app/",
});

export default api;
