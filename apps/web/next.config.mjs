/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  transpilePackages: ["@ibms/core"],
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
