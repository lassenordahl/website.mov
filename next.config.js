/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ignoreBuildErrors: true,
  env: {
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_ACCESS_SECRET: process.env.AWS_ACCESS_SECRET,
    BUCKET_NAME: process.env.BUCKET_NAME,
  }
}

module.exports = nextConfig
