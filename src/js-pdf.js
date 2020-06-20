const jsPDF = require('jspdf');
const html2canvas = require('html2canvas');
const { defaultOpts } = require('./config');

function onCanvasRendered(canvas, opts) {
  // ----- jsPDF -----
  let pdf = new jsPDF(opts.jsPDF);
  let pdfWidth = pdf.internal.pageSize.getWidth(),
      pdfHeight = pdf.internal.pageSize.getHeight();

  // Canvas to dataUri
  let pageData = canvas.toDataURL(opts.imageType, 1.0);
  const imgProps= pdf.getImageProperties(pageData);
  const imgHeight = pdfWidth / imgProps.width * imgProps.height;
  let images = function(type) {
    let types = {
      'image/jpeg': 'JPEG',
      'image/png': 'PNG',
      'image/webp': 'WEBP'
    };
    return types[type];
  };

  // height which not yet print to PDF.
  let leftHeight = imgHeight;
  // each page's start position
  let position = 0;

  // check if content needs multi pages
  if (leftHeight < pdfHeight) {
    pdf.addImage(pageData, images(opts.imageType), 0, 0, pdfWidth, imgHeight);
  } else {
    while (leftHeight > 0) {
      pdf.addImage(pageData, images(opts.imageType), 0, position, pdfWidth, pdfHeight);
      leftHeight -= pdfHeight;
      position -= pdfHeight;
      // check if there's still left content
      if (leftHeight > 0) {
        pdf.addPage();
      }
    }
  }

  // save pdf
  opts.success(pdf);
}

function html2PDF(dom, opts = {}) {
  opts = Object.assign(defaultOpts, opts);
  // ----- html2canvas -----
  return html2canvas(dom, opts.html2canvas).then(function(canvas) {
    return onCanvasRendered(canvas, opts);
  });
}

if (window) {
  window.html2PDF = html2PDF;
}

module.exports = html2PDF;
