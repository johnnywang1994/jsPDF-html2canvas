export const defaultOpts = {
  jsPDF: {
    unit: 'px',
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
  output: 'jspdf-generate.pdf',
  init: function() {},
  success: function(pdf) {
    pdf.save(this.output);
  }
}
