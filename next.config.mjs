/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        domains: ['cdn.sanity.io'],
      },
    env: {
      SANITY_PROJECT_ID: '4ksy39ot',
    },
    reactStrictMode: true,
    typescript: {
      // Setting this to false will ensure that TypeScript errors are not ignored during build
      ignoreBuildErrors: true,
    },
};

export default nextConfig;
