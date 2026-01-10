/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const defaultDevApiBaseUrl = 'http://localhost:5000/api';
    let rawApiBaseUrl = process.env.NEXT_PUBLIC_API_URL || defaultDevApiBaseUrl;
    if (process.env.NODE_ENV !== 'production') {
      const rawAsString = String(rawApiBaseUrl || '');
      if (rawAsString.includes('vercel.app')) {
        rawApiBaseUrl = defaultDevApiBaseUrl;
      }
    }
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
