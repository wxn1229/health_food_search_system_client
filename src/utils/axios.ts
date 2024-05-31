import axios from "axios";
const axiosInstance = axios.create({
  // baseURL: "https://natural-comic-fawn.ngrok-free.app", // 替換為你的 API 基本 URL
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL, // 替換為你的 API 基本 URL
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default axiosInstance;
