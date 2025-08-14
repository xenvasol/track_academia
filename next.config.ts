import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    domains: [
      'firebasestorage.googleapis.com',
      'images.pexels.com',
      'http://localhost:8080',
      'https://flagcdn.com',
      'flagcdn.com',
      'images.unsplash.com',
      'www.facebook.com',
      'res.cloudinary.com'
    ],
  },
};

export default nextConfig;
