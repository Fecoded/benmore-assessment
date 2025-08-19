import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */

	target: "server",

	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/i,
			issuer: /\.[jt]sx?$/,
			use: ["@svgr/webpack"],
		});

		return config;
	},

	images: {
		remotePatterns: [
			{
				hostname: "images.unsplash.com",
				protocol: "https",
			},
		],
	},
};

export default nextConfig;
