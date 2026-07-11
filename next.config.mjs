import path from 'node:path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: { root: path.resolve(process.cwd()) },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
