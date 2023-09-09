import type { jsPDF } from 'jspdf';
import type { Options } from '../types';

const pixelRatio = window.devicePixelRatio;

// canvas to DataUri
function getPageData({ canvas, pdf, pdfContentWidth, opts }: {
  canvas: HTMLCanvasElement;
  pdf: jsPDF;
  pdfContentWidth: number;
  opts: Options;
}) {
  const pageData = canvas.toDataURL(opts.imageType, opts.imageQuality);
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
