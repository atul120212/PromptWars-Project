/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Google Cloud Run Docker deployment
  // Produces a self-contained .next/standalone output with minimal footprint
  output: 'standalone',
};

export default nextConfig;
