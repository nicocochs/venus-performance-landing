/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/afiliados', destination: '/afiliados.html' },
    ]
  },
}
module.exports = nextConfig
