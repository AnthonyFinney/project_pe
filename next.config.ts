import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */ images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "placehold.co",
            },
        ],
    },
    webpack(config) {
        config.ignoreWarnings = [
            ...(config.ignoreWarnings || []),
            {
                module: /@supabase[\\/]realtime-js[\\/]dist[\\/]module[\\/]lib[\\/]websocket-factory\.js/,
                message:
                    /Critical dependency: the request of a dependency is an expression/,
            },
        ];
        return config;
    },
};

export default nextConfig;
