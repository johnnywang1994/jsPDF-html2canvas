// reference
// 1. tutorial: https://www.jianshu.com/p/570c84ee2e8d
// 2. jsPDF-github: https://github.com/MrRio/jsPDF
// 3. jsPDF-Documentation: http://raw.githack.com/MrRio/jsPDF/master/docs/

function html2PDF(dom, opts = {}) {
  // default opts
  opts = Object.assign({
    jsPDF: {
      unit: 'pt',
      format: 'a4'
    },
    imageType: 'image/jpeg',
    // customFont: '',
    output: 'js.pdf', 
    success: function(pdf) {
      pdf.save(opts.output);
    }
  }, opts);

  // ----- html2canvas -----
  html2canvas(dom, {
    onrendered(canvas) {
      
      let contentWidth = canvas.width,
          contentHeight = canvas.height;
      
      // 1. height which one page can contain( translate from a4's height to canvas's height )
      // 2. height which not yet print to PDF.
      let pageHeight = contentWidth / 595.28 * 841.89,
          leftHeight = contentHeight;
      
      // each page's start position
      let position = 0;

      // translate content by a4's size
      let imgWidth = 595.28,
          imgHeight = 595.28/contentWidth * contentHeight;

      // Canvas to dataUri
      let pageData = canvas.toDataURL(opts.imageType, 1.0);
      let images = function(type) {
        let types = {
          'image/jpeg': 'JPEG',
          'image/png': 'PNG',
          'image/webp': 'WEBP'
        };
        return types[type];
      };

      // ----- jsPDF -----
      let pdf = new jsPDF(opts.jsPDF);
      
      // set custom font, eg: 'chinese', which is made by offical website's tool:
      // https://rawgit.com/MrRio/jsPDF/master/fontconverter/fontconverter.html
      // pdf.setFont(opts.customFont);

      // check if content needs multi pages
      if (leftHeight < pageHeight) {
        pdf.addImage(pageData, images(opts.imageType), 0, 0, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          pdf.addImage(pageData, images(opts.imageType), 0, position, imgWidth, imgHeight);
          leftHeight -= pageHeight;
          position -= 841.89;
          // check if there's still left content
          if (leftHeight > 0) {
            pdf.addPage();
          }
        }
      }
      
      // save pdf
      opts.success(pdf);
    }
  })
}