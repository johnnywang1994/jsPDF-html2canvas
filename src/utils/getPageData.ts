import type { jsPDF } from 'jspdf';
import type { Options } from '../types';

const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

// canvas to DataUri
function getPageData({ canvas, pdf, pdfContentWidth, opts }: {
  canvas: HTMLCanvasElement;
  pdf: jsPDF;
  pdfContentWidth: number;
  opts: Options;
}) {
  if (!canvas || !canvas.toDataURL) {
    throw new Error('[jspdf-html2canvas] Invalid canvas element');
  }
  const imageQuality = Math.max(0, Math.min(1, opts.imageQuality));
  const pageData = canvas.toDataURL(opts.imageType, imageQuality);
  const imgProps = pdf.getImageProperties(pageData);
  const printWidth = !!opts.autoResize
    ? pdfContentWidth
    : imgProps.width / pixelRatio;
  const printHeight = !!opts.autoResize
    ? pdfContentWidth / imgProps.width * imgProps.height
    : imgProps.height / pixelRatio;
  return {
    pageData,
    printWidth,
    printHeight,
  };
}

export default getPageData;
