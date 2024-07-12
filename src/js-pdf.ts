import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { defaultOpts } from './config';
import renderCanvas from './render-canvas';
import usePlugins from './plugins';
import joinObject from './utils/joinObject';

import type { Options, PdfInstance } from './types';

// ----- jsPDF -----
function getPdf(opts: Options): PdfInstance {
  const { margin } = opts;
  const pdf = new jsPDF(opts.jsPDF);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const pdfContentWidth = pdfWidth - (margin.left + margin.right);
  const pdfContentHeight = pdfHeight - (margin.top + margin.bottom);
  const position = 0;
  const currentPage = 1;
  const pageOfCurrentNode = 1;
  return {
    pdf,
    pdfWidth,
    pdfHeight,
    pdfContentWidth,
    pdfContentHeight,
    position,
    currentPage,
    pageOfCurrentNode,
  };
}

async function html2PDF(
  dom: HTMLElement | HTMLElement[],
  opts: Partial<Options> = {},
) {
  const _opts = joinObject<Options>(defaultOpts, opts);
  const pdfInstance = getPdf(_opts);
  // init pdf
  _opts.init.call(_opts, pdfInstance.pdf);

  // multi pages by nodes
  if ('length' in dom) {
    for (let i = 0; i < dom.length; i++) {
      const canvas = await html2canvas(dom[i], _opts.html2canvas);
      renderCanvas(canvas, pdfInstance, _opts);
    }
  } else {
    // single page for one node
    const canvas = await html2canvas(dom, _opts.html2canvas);
    renderCanvas(canvas, pdfInstance, _opts);
  }

  // check plugins
  await usePlugins(pdfInstance, _opts);

  // save pdf
  _opts.success.call(_opts, pdfInstance.pdf);

  return pdfInstance.pdf;
}

export default html2PDF;
