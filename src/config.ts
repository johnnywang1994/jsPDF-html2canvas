import type { Options } from './types';

export const defaultOpts: Options = {
  jsPDF: {
    unit: 'pt',
    format: 'a4',
  },
  html2canvas: {
    imageTimeout: 15000,
    logging: true,
    useCORS: false,
  },
  margin: {
    right: 0,
    top: 0,
    bottom: 0,
    left: 0,
  },
  imageType: 'image/jpeg',
  imageQuality: 1,
  autoResize: true,
  output: 'jspdf-generate.pdf',
  watermark: undefined,
  init: function() {},
  success: function(pdf) {
    pdf.save(this.output);
  }
}
