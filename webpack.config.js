const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  mode: process.env.NODE_ENV,
  entry: path.join(__dirname, 'src/index.ts'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: isProd ? 'jspdf-html2canvas.min.js' : 'jspdf-html2canvas.js',
    library: {
      name: {
        root: 'html2PDF',
        amd: 'jspdf-html2canvas',
        commonjs: 'jspdf-html2canvas'
      },
      type: 'umd',
      export: 'default'
    },
    globalObject: 'this',
    clean: true
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
    jspdf: {
      commonjs: 'jspdf',
      commonjs2: 'jspdf',
      amd: 'jspdf',
      root: 'jspdf'
    },
    'html2canvas-pro': {
      commonjs: 'html2canvas-pro',
      commonjs2: 'html2canvas-pro',
      amd: 'html2canvas-pro',
      root: 'html2canvas'
    }
  },
  experiments: {
    outputModule: false
  }
}
