import type { jsPDF } from 'jspdf';
import getPageData from './utils/getPageData';
import images from './utils/images';
import type { PdfInstance, Options } from './types';


function setPdf(
  pdfInstance: PdfInstance,
  pdf: jsPDF,
  position: number,
  currentPage: number,
  pageOfCurrentNode: number,
) {
  pdfInstance.pdf = pdf;
  pdfInstance.position = position;
  pdfInstance.currentPage = currentPage;
  pdfInstance.pageOfCurrentNode = pageOfCurrentNode;
}

function renderCanvas(
  canvas: HTMLCanvasElement,
  pdfInstance: PdfInstance,
  opts: Options,
) {
  let {
    pdf,
    pdfContentWidth,
    pdfContentHeight,
    pdfWidth,
    pdfHeight,
    position,
    currentPage,
    pageOfCurrentNode } = pdfInstance;
  const { pageData, printWidth, printHeight } = getPageData({ canvas, pdf, pdfContentWidth, opts });

  // height which not yet print to PDF.
  let leftHeight = printHeight;

  // check if need reset position(change node)
  if (position < 0) {
    pdf.addPage();
    currentPage += 1;
    pageOfCurrentNode = 1;
    position = 0;
  }

  // check if content needs multi pages
  const { margin } = opts;
  while (leftHeight > 0) {
    // add content
    pdf.addImage(
      pageData,
      images(opts.imageType),
      margin.left,
      position +
        margin.top * pageOfCurrentNode +
        margin.bottom * (pageOfCurrentNode - 1),
      printWidth,
      printHeight,
    );
    // add margin top/bottom
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pdfWidth, margin.top, 'F');
    pdf.rect(0, pdfHeight - margin.bottom, pdfWidth, margin.bottom, 'F');
    // check left content
    if (leftHeight < pdfContentHeight) {
      position -= leftHeight;
      break;
    } else {
      leftHeight -= pdfContentHeight;
      position -= pdfHeight;
      pdf.addPage();
      currentPage += 1;
      pageOfCurrentNode += 1;
    }
  }

  // expose for next round
  setPdf(pdfInstance, pdf, position, currentPage, pageOfCurrentNode);
}

export default renderCanvas;
