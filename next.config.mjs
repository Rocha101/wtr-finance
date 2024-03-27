/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: `http${!process.env.NEXT_PUBLIC_SITE_URL ? "s" : ""}://${
      typeof window !== "undefined" ? window.location.origin : ""
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
