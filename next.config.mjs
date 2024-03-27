/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: `http${process.env.NEXT_PUBLIC_VERCEL_URL ? "s" : ""}://${
      process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL
    }/api`,
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
