const jspdf = require('jspdf');
const html2canvas = require('html2canvas');
const { defaultOpts } = require('./config');

const { jsPDF } = jspdf;

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
  const position = 0; // page's start position
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
  const imgProps = pdf.getImageProperties(pageData);
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

  // check if need reset position
  if (position < 0) {
    pdf.addPage();
    position = 0;
  }

  // check if content needs multi pages
  if (leftHeight < pdfHeight) {
    pdf.addImage(pageData, images(opts.imageType), 0, position, pdfWidth, imgHeight);
    position -= leftHeight;
  } else {
    while (leftHeight > 0) {
      pdf.addImage(pageData, images(opts.imageType), 0, position, pdfWidth, imgHeight);
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

function addWaterMark(pdf, opts) {
  const totalPages = pdf.internal.getNumberOfPages();
  // image watermark
  if (opts.watermarkImg) {
    const waterProps = pdf.getImageProperties(opts.watermarkImg);
    const ratio = opts.watermark.scale || 1;
    for (i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      // custom handler with image
      if (opts.watermark.src && opts.watermark.handler) {
        opts.watermark.handler.call(opts, pdf, opts.watermarkImg);
      } else {
        // auto centeral watermark with ratio
        pdf.addImage(
          opts.watermarkImg,
          'PNG',
          (pdf.internal.pageSize.width - waterProps.width * ratio) / 2,
          (pdf.internal.pageSize.height - waterProps.height * ratio) / 2,
          waterProps.width * ratio,
          waterProps.height * ratio
        );
      }
    }
  // custom function handler
  } else if (typeof opts.watermark === 'function') {
    for (i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      opts.watermark.call(opts, pdf);
    }
  } else {
    console.warn('[jspdf-html2canvas] "watermark" option should be either "string" or "function" type.');
  }
  return pdf;
}

function useWaterMark(opts, callback) {
  const watermarkImg = new Image();
  const src = typeof opts.watermark === 'string'
    ? opts.watermark
    : opts.watermark.src;
  // image watermark
  if (src) {
    watermarkImg.onload = function() {
      callback(watermarkImg);
    };
    watermarkImg.crossOrigin = 'Anonymous';
    watermarkImg.src = src;
  } else {
    callback();
  }
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

  // check watermark
  if (opts.watermark) {
    useWaterMark(opts, function(watermarkImg) {
      if (watermarkImg) {
        opts.watermarkImg = watermarkImg;
      }
      pdfInstance.pdf = addWaterMark(pdfInstance.pdf, opts);
      // save pdf
      opts.success.call(opts, pdfInstance.pdf);
    });
  } else {
    // save pdf
    opts.success.call(opts, pdfInstance.pdf);
  }
}

module.exports = html2PDF;
