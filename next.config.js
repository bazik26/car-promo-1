/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    unoptimized: true, // Для Railway
  },
  output: 'standalone', // Оптимизация для Railway
}

module.exports = nextConfig

