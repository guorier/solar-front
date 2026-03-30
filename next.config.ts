// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  compiler: { styledComponents: true },

  async rewrites() {
    const API = process.env.NEXT_PUBLIC_API_URL; // http://192.168.20.13:60821
    const PLANT = process.env.PLANT_GATEWAY; // http://192.168.20.49:60823
    const PLANT_COMMON = process.env.PLANT_COMMON_GATEWAY; // http://192.168.20.49:60821

    // if (!API) throw new Error('NEXT_PUBLIC_API_URL is not set');
    // if (!PLANT) throw new Error('PLANT_GATEWAY is not set');
    // if (!PLANT_COMMON) throw new Error('PLANT_COMMON_GATEWAY is not set');

    if (!API || !PLANT || !PLANT_COMMON) {
      console.warn('[rewrites] env missing. rewrites disabled.');
      return [];
    }

    const apiUrl = API.replace(/\/$/, '');
    const plantUrl = PLANT.replace(/\/$/, '');
    const plantCommonUrl = PLANT_COMMON.replace(/\/$/, '');

    return [
      // ✅ apiClient.baseURL = '/solar/api' 대응
      {
        source: '/solar/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },

      // ✅ plantClient.baseURL = '/plant' 대응
      {
        source: '/plant/api/:path*',
        destination: `${plantUrl}/api/:path*`,
      },

      // ✅ plantCommonClient.baseURL = '/common' 대응
      {
        source: '/common/:path*',
        destination: `${plantCommonUrl}/api/com/:path*`,
      },
    ];
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;
