import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3003", // 替換為你的 API 基本 URL
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
