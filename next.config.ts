/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Authorizes Google / Gmail avatars
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com', // Authorizes Clerk hosted user images
      },
    ],
  },
};

export default nextConfig;