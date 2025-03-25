/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lwuhpdkimchmdladsiiv.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Keep any existing patterns you might have
    ],
  },
}

module.exports = nextConfig

