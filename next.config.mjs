import createMDX from "@next/mdx";

const withMDX = createMDX({});

/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  output: "export",
  trailingSlash: true,
  turbopack: { root: process.cwd() },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: { unoptimized: true },
};

export default withMDX(nextConfig);
