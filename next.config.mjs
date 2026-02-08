/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "randomuser.me",
        // Only allow images from the portait/api directory
        pathname: '/api/portraits/**', 
      },
      {
        protocol: 'https',
        hostname: "backend-sepia-omega.vercel.app",
        // Crucial: Only allow your specific uploads folder
        // Use your actual storage path here (e.g., /uploads or /images)
        pathname: '/api/files/**', 
      },
    ],
    // Optional: Protect your memory by limiting allowed output sizes
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },
};

export default nextConfig;