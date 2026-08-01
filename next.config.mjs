/** @type {import('next').NextConfig} */
const nextConfig = {
  // react-force-graph pulls in browser-only deps; keep it out of the server bundle.
  // Lane B must import the Canvas with next/dynamic + { ssr: false } regardless.
  serverExternalPackages: ['react-force-graph-2d'],
}

export default nextConfig
