// next.config.ts
import { NextConfig } from 'next';
import { NextFederationPlugin } from '@module-federation/nextjs-mf';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config, { isServer }) {
    if (!isServer) {
      config.plugins.push(
        new NextFederationPlugin({
          name: 'productList',
          filename: 'static/chunks/remoteEntry.js',
          exposes: {
            './ProductList': './src/pages/ProductList.tsx',
          },
          shared: {
            react: { singleton: true, eager: true, requiredVersion: false },
            'react-dom': { singleton: true, eager: true, requiredVersion: false },
          },
          extraOptions: {},
        })
      );
    }
    return config;
  },
};

export default nextConfig;
