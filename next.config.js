/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.printrove.com' },
      { protocol: 'https', hostname: 'printrove.s3.ap-south-1.amazonaws.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  experimental: {
    serverActions: { allowedOrigins: ['localhost:3000'] },
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.paypal.com https://www.paypalobjects.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://api.printrove.com https://printrove.s3.ap-south-1.amazonaws.com https://images.unsplash.com https://res.cloudinary.com https://lh3.googleusercontent.com https://www.paypalobjects.com",
              "font-src 'self' data:",
              "connect-src 'self' https://api-m.sandbox.paypal.com https://api-m.paypal.com https://www.paypal.com https://api.printrove.com https://api.resend.com",
              "frame-src https://www.paypal.com",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
