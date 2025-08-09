/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns:[
        {
            protocol: 'https',
            hostname: 'pub-41a4810ee9534a61974570db195745e5.r2.dev',
            port: '',
            pathname: '/**',
        },
    ]
  },
};

export default nextConfig;
