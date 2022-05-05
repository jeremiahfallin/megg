module.exports = {
  reactStrictMode: true,
  experimental: {
    outputStandalone: true,
  },
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/graphql",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://keystone:8000/api/graphql"
            : "http://keystone:8000/api/graphql",
      },
    ];
  },
};
