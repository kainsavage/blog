/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blog-teamclerks-net-images.s3.amazonaws.com',
        port: '',
      },
    ],
  },
};

module.exports = nextConfig;
