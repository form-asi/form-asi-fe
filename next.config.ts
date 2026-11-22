import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
      // 디자인에서 내보낸 아이콘을 그대로 두고, 색만 currentColor로 바꿔 글자색 토큰을 따르게 한다
      "*.svg": {
        condition: { path: /^src\/assets\/icons\// },
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              svgProps: { "aria-hidden": "true" },
              svgoConfig: {
                plugins: [
                  { name: "preset-default", params: { overrides: { removeViewBox: false } } },
                  { name: "convertColors", params: { currentColor: true } },
                ],
              },
            },
          },
        ],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
