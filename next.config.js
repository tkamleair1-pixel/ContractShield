/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  webpack: (config) => {
    // Handle canvas dependency for pdfjs-dist (not needed in browser)
    config.resolve.alias.canvas = false;
    return config;
  },
}
module.exports = nextConfig
