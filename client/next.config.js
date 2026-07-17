/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a self-contained production server under .next/standalone (server.js +
  // only the node_modules actually used, traced automatically). Lets the Docker
  // runtime stage ship a tiny image and run `node server.js` instead of the full
  // `next start` toolchain. No effect on `npm run dev`.
  output: 'standalone',
  // Don't run ESLint during `next build`. Linting is a separate CI/dev gate
  // (`npm run lint`); a formatting error must not fail the production image
  // build. Type errors are still enforced by the build.
  eslint: { ignoreDuringBuilds: true },
  reactStrictMode: false,
  images: {
    loader: 'custom',
    loaderFile: './utils/image.loader.js',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/fakebook-2025/image/upload/*'
      }
    ]
  }
};

module.exports = nextConfig;
