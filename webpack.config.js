const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  mode: process.env.NODE_ENV,
  entry: path.join(__dirname, 'src/js-pdf.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: isProd ? 'js-pdf.min.js' : 'js-pdf.js',
    library: {
      root: 'html2PDF',
      amd: 'jspdf-html2canvas',
      commonjs: 'jspdf-html2canvas'
    },
    libraryTarget: 'umd'
  },
  externals: {
    jspdf: 'jspdf',
    html2canvas: 'html2canvas'
  },
}
