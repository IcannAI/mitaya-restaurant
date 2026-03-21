import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Coexist with Vite during migration
  // Remove when Vite is fully replaced
  experimental: {
    typedRoutes: true,
  },
}

export default nextConfig
