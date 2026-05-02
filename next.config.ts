/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'www.istockphoto.com',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: ['192.168.31.160', 'localhost'],
  },
};

export default nextConfig;
