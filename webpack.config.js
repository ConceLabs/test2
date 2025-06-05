const path = require('path');

module.exports = {
  entry: './src/app/main.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
};
