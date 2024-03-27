/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: NEXT_PUBLIC_SITE_URL
      ? `http://${NEXT_PUBLIC_SITE_URL}/api`
      : process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
      ? `https://${process.env.MAIN_URL}/api`
      : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`,
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
