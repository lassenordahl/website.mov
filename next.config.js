const withOptimizedImages = require('next-optimized-images');

module.exports = withOptimizedImages({
  reactStrictMode: true,
  ignoreBuildErrors: true,
  env: {
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_ACCESS_SECRET: process.env.AWS_ACCESS_SECRET,
    BUCKET_NAME: process.env.BUCKET_NAME,
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: 'file-loader',
        options: {
          outputPath: 'static/assets/',
          publicPath: '/_next/static/assets/',
          name: '[name].[ext]',
        },
      },
    });

    return config;
  },
});
