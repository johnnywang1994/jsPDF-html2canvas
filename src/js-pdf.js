const jsPDF = require('jspdf');
const html2canvas = require('html2canvas');
const { defaultOpts } = require('./config');

const images = function(type) {
  let types = {
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/webp': 'WEBP'
  };
  return types[type];
};

// ----- jsPDF -----
function getPdf(opts) {
  const pdf = new jsPDF(opts.jsPDF);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const position = 0;
  return {
    pdf,
    pdfWidth,
    pdfHeight,
    position,
  };
}

// canvas to DataUri
function getPageData({ canvas, pdf, pdfWidth, opts }) {
  const pageData = canvas.toDataURL(opts.imageType, 1.0);
  const imgProps= pdf.getImageProperties(pageData);
  const imgHeight = pdfWidth / imgProps.width * imgProps.height;
  return {
    pageData,
    imgHeight,
  };
}

function onCanvasRendered(canvas, pdfInstance, opts) {
  let { pdf, pdfWidth, pdfHeight, position } = pdfInstance;
  const { pageData, imgHeight } = getPageData({ canvas, pdf, pdfWidth, opts });

  // height which not yet print to PDF.
  let leftHeight = imgHeight;
  // each page's start position
  // let position = 0;

  // check if content needs multi pages
  if (leftHeight < pdfHeight) {
    if (position < 0) {
      pdf.addPage();
    }
    pdf.addImage(pageData, images(opts.imageType), 0, position, pdfWidth, imgHeight);
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

  // expose pdf for later usage
  return { pdf, position };
}

async function html2PDF(dom, opts = {}) {
  opts = Object.assign(defaultOpts, opts);
  const pdfInstance = getPdf(opts);

  // multi pages by nodes
  if (dom.length) {
    for (let i = 0; i < dom.length; i++) {
      const canvas = await html2canvas(dom[i], opts.html2canvas);
      const { pdf, position } = onCanvasRendered(canvas, pdfInstance, opts);
      pdfInstance.pdf = pdf;
      pdfInstance.position = position;
    }
  } else {
    // single page for one node
    const canvas = await html2canvas(dom, opts.html2canvas);
    onCanvasRendered(canvas, pdfInstance, opts);
  }
  
  // save pdf
  opts.success(pdfInstance.pdf);
}

if (window) {
  window.html2PDF = html2PDF;
}

module.exports = html2PDF;
