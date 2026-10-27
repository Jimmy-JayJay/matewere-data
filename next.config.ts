import type { NextConfig } from 'next'

// Fully static site: every page is prerendered at build. cacheComponents (the scaffold default)
// is off because it streams pages, so an unknown dataset slug answered 200 instead of 404.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
}

export default nextConfig
