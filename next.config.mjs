/** @type {import('next').NextConfig} */
import { env } from 'process';

const nextConfig = {
    images: {
        domains: ['cdn.sanity.io'],
      },
    env: {
      SANITY_PROJECT_ID: '4ksy39ot',
    }
};

export default nextConfig;
