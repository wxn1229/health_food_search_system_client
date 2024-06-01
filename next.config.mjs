/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://natural-comic-fawn.ngrok-free.app/api/:path*", // 代理到你的后端服务器
      },
    ];
  },
};

export default nextConfig;
