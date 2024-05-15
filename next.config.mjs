/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.NEXT_PUBLIC_SITE_URL
      ? `http://${process.env.NEXT_PUBLIC_SITE_URL}/api`
      : process.env.NEXT_PUBLIC_VERCEL_ENV === "production" &&
        `https://wtr-finance.vercel.app/api`,
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/sign-in",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
