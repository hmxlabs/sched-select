module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      return webpackConfig;
    },
  },
  devServer: (devServerConfig) => {
    // Remove deprecated/invalid options that are incompatible with webpack-dev-server v5
    delete devServerConfig.onAfterSetupMiddleware;
    delete devServerConfig.onBeforeSetupMiddleware;
    delete devServerConfig.https;
    
    // Convert https to server option if it was set
    if (process.env.HTTPS === 'true') {
      devServerConfig.server = 'https';
    }
    
    // Use the new setupMiddlewares API
    devServerConfig.setupMiddlewares = (middlewares, devServer) => {
      return middlewares;
    };
    
    return devServerConfig;
  },
};
