import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Three.js + R3F to work in the browser-only context
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  
  // Optimized images
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
