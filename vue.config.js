const path = require('path');

module.exports = {
  configureWebpack: {
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
          "@" : path.resolve(__dirname, 'src/')
      }
    },
  }
}
