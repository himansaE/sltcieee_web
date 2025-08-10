/** @type {import('next').NextConfig} */

const endpoint = process.env.NEXT_PUBLIC_R2_PUBLIC_ENDPOINT;

let remotePatterns = [
  {
    protocol: 'https',
    hostname: 'pub-480db4af15a94f74956fec2a164bcd5f.r2.dev',
    port: '',
    pathname: '/**',
  },
];

if (endpoint) {
  try {
    const { protocol, hostname, pathname } = new URL(endpoint);
    const proto = protocol.replace(':', '');
    const pathPattern = pathname === '/' ? '/**' : pathname.endsWith('/') ? `${pathname}**` : `${pathname}/**`;
    remotePatterns = [
      {
        protocol: proto,
        hostname,
        port: '',
        pathname: pathPattern,
      },
    ];
  } catch (e) {
    console.warn('Invalid NEXT_PUBLIC_R2_PUBLIC_ENDPOINT, falling back to default remotePatterns');
  }
}

const nextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
