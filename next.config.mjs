/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    return [
      {
        source: '/api/:path*',
        destination: `${apiBaseUrl}/:path*`,
      },
    ]
  },
};

export default nextConfig;
