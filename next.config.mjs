/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const rawApiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const trimmed = rawApiBaseUrl.endsWith('/') ? rawApiBaseUrl.slice(0, -1) : rawApiBaseUrl;
    const apiBaseUrl = trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
    return [
      {
        source: '/api/:path*',
        destination: `${apiBaseUrl}/:path*`,
      },
    ]
  },
};

export default nextConfig;
