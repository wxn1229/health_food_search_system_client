import axios from "axios";
const axiosInstance = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_SERVER_URL, // 替換為你的 API 基本 URL
  baseURL: "http://localhost:3003", // 替換為你的 API 基本 URL
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default axiosInstance;
