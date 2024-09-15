/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    loader: 'custom',
    loaderFile: './utils/image.loader.js',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.comm',
        port: '',
        pathname: '/fakebook-2025/image/upload/*'
      }
    ]
  }
};

module.exports = nextConfig;
