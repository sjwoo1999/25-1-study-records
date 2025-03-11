/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/main-page',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;