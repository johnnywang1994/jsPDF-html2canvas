const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'src/index.ts'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'jspdf-html2canvas.esm.js',
    library: {
      type: 'module'
    },
    clean: false
  },
  experiments: {
    outputModule: true
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: { '@': path.join(__dirname, 'src') },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    jspdf: 'jspdf',
    'html2canvas-pro': 'html2canvas-pro'
  }
};
