/** @type {import('next').NextConfig} */
const BUCKET_NAME = process.env.NEXT_PUBLIC_BUCKET_NAME;
const nextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '1337',
            },
            {
                protocol: 'https',
                hostname: `${BUCKET_NAME}.s3.us-east-1.amazonaws.com`
            }
        ]
    }
};

export default nextConfig;
