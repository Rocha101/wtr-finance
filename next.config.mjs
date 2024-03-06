/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_TURSO_DB_URL: process.env.NEXT_TURSO_DB_URL,
    NEXT_TURSO_DB_AUTH_TOKEN: process.env.NEXT_TURSO_DB_AUTH_TOKEN,
  },
};

export default nextConfig;
