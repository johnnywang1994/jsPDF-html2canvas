import type { jsPDF } from 'jspdf';
import type { Options, PdfInstance, jsPDFInternal } from '../types';
import images from '../utils/images';


function addWaterMark(pdf: jsPDF, opts: Options) {
  const totalPages = (pdf.internal as jsPDFInternal).getNumberOfPages();
  if (typeof opts.watermark === 'function') {
    // custom function handler
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      const param = {
        pdf,
        pageNumber: i,
        totalPageNumber: totalPages,
      };
      opts.watermark.call(opts, param);
    }
  } else if (opts.watermarkImg) {
    // image watermark
    const waterProps = pdf.getImageProperties(opts.watermarkImg);
    const ratio = typeof opts.watermark !== 'string'
      ? opts.watermark?.scale || 1
      : 1;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      if (typeof opts.watermark !== 'string' && opts.watermark?.handler) {
        // custom handler with image
        const param = {
          pdf,
          pageNumber: i,
          totalPageNumber: totalPages,
          imgNode: opts.watermarkImg,
        };
        opts.watermark.handler.call(opts, param);
      } else {
        // auto centeral watermark with ratio
        pdf.addImage(
          opts.watermarkImg,
          images('image/png'),
          (pdf.internal.pageSize.width - waterProps.width * ratio) / 2,
          (pdf.internal.pageSize.height - waterProps.height * ratio) / 2,
          waterProps.width * ratio,
          waterProps.height * ratio
        );
      }
    }
  } else {
    console.warn('[jspdf-html2canvas] "watermark" option should be either "string" or "function" type.');
  }
  return pdf;
}

function useWaterMark(
  pdfInstance: PdfInstance,
  opts: Options,
) {
  return new Promise((resolve) => {
    const watermarkImg = new Image();
    const src = typeof opts.watermark === 'string'
      ? opts.watermark
      : typeof opts.watermark !== 'function' ? opts.watermark?.src : false;
    const resolveWithWaterMark = () => {
      pdfInstance.pdf = addWaterMark(pdfInstance.pdf, opts);
      resolve(null);
    };
    // image watermark
    if (!!src) {
      watermarkImg.onload = function() {
        opts.watermarkImg = watermarkImg;
        resolveWithWaterMark();
      };
      watermarkImg.crossOrigin = 'Anonymous';
      watermarkImg.src = src;
    } else if (typeof opts.watermark === 'function') {
      resolveWithWaterMark();
    }
  })
}

export default useWaterMark;
