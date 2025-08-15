/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Desabilitar otimização para URLs do Cloudinary (usar transformações nativas)
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
};

module.exports = nextConfig;
