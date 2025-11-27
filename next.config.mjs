/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      // Unsplash domains
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.unsplash.com",
      },

      // Your dynamic external product image domains
      {
        protocol: "https",
        hostname: "www.vibrantbd.com",
      },
      {
        protocol: "https",
        hostname: "vibrantbd.com",
      },

      // Allow ANY OTHER product image domains
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
