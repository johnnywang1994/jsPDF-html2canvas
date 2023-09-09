<p align="center">
  <a href="https://npmcharts.com/compare/jspdf-html2canvas?minimal=true"><img src="https://img.shields.io/npm/dm/jspdf-html2canvas.svg?sanitize=true" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/jspdf-html2canvas"><img src="https://img.shields.io/npm/v/jspdf-html2canvas.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.jsdelivr.com/package/npm/jspdf-html2canvas"><img src="https://data.jsdelivr.com/v1/package/npm/jspdf-html2canvas/badge" /></a>
  <a href="https://www.npmjs.com/package/jspdf-html2canvas"><img src="https://img.shields.io/npm/l/jspdf-html2canvas.svg?sanitize=true" alt="License"></a>
</p>

# jsPDF-html2canvas
A combine usage with jsPDF &amp; html2canvas, which translating html content to PDF file. Written in Typescript.

> html2PDF function will auto fit the target dom width into PDF size. So no need to worry about the overflow part. And if the content height is over 1 pdf, it'll auto seperate it into another pdf page.


## Install

```
npm i jspdf-html2canvas
```

```js
import html2PDF from 'jspdf-html2canvas';

html2PDF(node, options);
```

since this plugin is an umd module, you can also use by cdn with `/dist/jspdf-html2canvas.min.js`, just remember to include both `jspdf` & `html2canvas` cdn before this plugin.

```js
<script src="https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jspdf-html2canvas@latest/dist/jspdf-html2canvas.min.js"></script>
```


## html2PDF([Node, NodeList], options)

convert specific DOM target to print it into PDF file.

Automatically, it'll save the file, or you can define the `success` callback to do with the jsPDF instance.

```html
<!-- default a4's width is 595.28px -->
<div id="page" style="width: 595.28px;color: black;background: white;">
  <h3>PDF for Test</h3>
  <p>Here is some content for testing!!</p>
</div>

<button id="btn">Generate</button>
```

```js
let btn = document.getElementById('btn');
let page = document.getElementById('page');

btn.addEventListener('click', function(){
  html2PDF(page, {
    jsPDF: {
      format: 'a4',
    },
    imageType: 'image/jpeg',
    output: './pdf/generate.pdf'
  });
});
```

you can easily `await` the method to wait for pdf generated.

```js
async function printPdf() {
  const pdf = await html2PDF(page, {
    // ...
  });
  // do something with pdf(jsPdf instance)
}
```

> If there's some white space on top of the outputed PDF file, it might caused by the scroll problem, just add some settings for `html2canvas` plugin as following. [see the reference](https://stackoverflow.com/questions/57936607/why-there-is-a-white-space-on-the-top-on-html2canvas)
```js
html2PDF(page, {
  // ... other settings
  html2canvas: {
    scrollX: 0,
    scrollY: -window.scrollY,
  },
});
```

## Custom multiple page supported

There might be some situation you want to print DOM seperately, just easily give the nodeList with `length` in it, will adjust every nodes inside seperately into a new page in the same PDF output.

for example:

```html
<div id="page" style="width: 595.28px;color: black;background: white;">
  <div class="page page-1">
    <h3>Test page 1</h3>
    <p>This is an page for testing 1</p>
  </div>
  <div class="page page-2">
    <h3>Test page 2</h3>
    <p>This is an page for testing 1</p>
  </div>
  <div class="page page-3">
    <h3>Test page 3</h3>
    <p>This is an page for testing 1</p>
  </div>
</div>
```

```js
const pages = document.getElementsByClassName('page');

btn.addEventListener('click', function(){
  html2PDF(pages, {
    jsPDF: {
      format: 'a4',
    },
    imageType: 'image/jpeg',
    output: './pdf/generate.pdf'
  });
});
```


## Options

### - jsPDF

  - type: `Object`
  - default:
  ```js
  {
    unit: 'pt',
    format: 'a4'
  }
  ```

setting for creating jsPDF's instance, please ref to [JSPDF Documentation](http://raw.githack.com/MrRio/jsPDF/master/docs/)


### - html2canvas

  - type: `Object`
  - default:
  ```js
  {
    imageTimeout: 15000,
    logging: true,
    useCORS: false
  }
  ```

setting for `html2canvas` configs, please ref to [html2canvas Documentation](https://html2canvas.hertzen.com/documentation)


### - watermark

  - type: `String` | `Function` | `Object`
  - optional

setting for watermark in pdf, will add watermark into each pages of your outputed pdf file.

each data type has different usage as following:

#### datatype: `String` => image url
create image watermark in the center of each page with default image scale size `1`, please use `.png` file for watermark.

```js
html2PDF(page, {
  watermark: './test.png',
});
```

#### datatype: `Function` => custom handler
define custom handler to do things for each page of pdf file.

```js
html2PDF(page, {
  watermark({ pdf, pageNumber, totalPageNumber }) {
    // pdf: jsPDF instance
    pdf.setTextColor('#ddd');
    pdf.text(50, pdf.internal.pageSize.height - 30, `Watermark, page: ${pageNumber}/${totalPageNumber}`);
  },
});
```

#### datatype: `Object` => custom handler or resize image watermark
define image watermark with change `ratio`, or use custom `handler` to do with the image position.
```js
html2PDF(page, {
  watermark: {
    src: './test.png',
    scale: 0.5
  },
});
// or
html2PDF(page, {
  watermark: {
    src: './test.png',
    handler({ pdf, imgNode, pageNumber, totalPageNumber }) {
      const props = pdf.getImageProperties(imgNode);
      // do something...
      pdf.addImage(imgNode, 'PNG', 0, 0, 40, 40);
    },
  },
});
```

### - imageType

  - type: `String`
  - allowed: `image/jpeg`, `image/png`, `image/webp`
  - default: `image/jpeg`

define the target imageType, now only support for jpeg, png, webp

```js
// will be used like
let pageData = canvas.toDataURL(opts.imageType, opts.imageQuality);
```

### - imageQuality

  - type: `Number`
  - allowed: `0 - 1`
  - default: `1`

define the image quality transfered from canvas


### - margin

  - type: `Object{key => number}`
  - allowed key: `top`, `right`, `bottom`, `left`
  - default: `0`

define the margin of each page

### - autoResize

  - type: `Boolean`
  - default: `true`

define whether to auto resize the snapshot image to fit PDF layout size

### - output

  - type: `String`
  - default: `jspdf-generate.pdf`

define name of the output PDF file

```js
pdf.save(opts.output);
```

### - init

  - type: `Function`

```js
function init(pdf) {
  pdf.setFont('Myfont');
  pdf.setFontSize(10);
}
```

define some init for jspdf initiating before printing

### - success

  - type: `Function`
  - default:
  ```js
  function success(pdf) {
    pdf.save(this.output);
  }
  ```

callback function to do after all code, default will save the file with the output name setting.


## Defaults options

```js
const defaultOptions = {
  jsPDF: {
    unit: 'pt',
    format: 'a4',
  },
  html2canvas: {
    imageTimeout: 15000,
    logging: true,
    useCORS: false,
  },
  imageType: 'image/jpeg',
  imageQuality: 1,
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  watermark: undefined,
  autoResize: true,
  output: 'jspdf-generate.pdf',
  init: function() {},
  success: function(pdf) {
    pdf.save(this.output);
  }
}
```


## Recommend

if you want more custom & widing solutions, you can use this npm package

html2pdf: https://www.npmjs.com/package/html2pdf.js