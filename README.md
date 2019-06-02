# jsPDF-html2canvas
A combine usage with jsPDF &amp; html2canvas, which translating html content to PDF file.

## Install

```
npm i jspdf-html2canvas
```

```js
// import module function
import html2PDF from 'jspdf-html2canvas';
// or
const html2PDF = require('jspdf-html2canvas');
```

## html2PDF(DOM, options)

convert specific DOM target to print it into PDF file.

Automatically, it'll save the file, or you can define the success function to do with the

jsPDF instance.

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
    jsPDF: {},
    imageType: 'image/jpeg',
    output: './pdf/generate.pdf'
  });
});
```

## Options

- **jsPDF**

setting for creating jsPDF's instance

```js
let doc = new jsPDF(opts.jsPDF);
```

- **imageType**

define the target imageType, now only support for jpeg, png, webp

```js
let pageData = canvas.toDataURL(opts.imageType, 1.0);
```

- **output**

define name of the output PDF file

```js
pdf.save(opts.output);
```

- **success**

callback function to do after all code, default will save the file with the output name setting.

## Defaults options

```js
options = {
  jsPDF: {
    unit: 'pt',
    format: 'a4'
  },
  imageType: 'image/jpeg',
  output: 'js.pdf', 
  success: function(pdf) {
    pdf.save(opts.output);
  }
}
```

## Recommend

if you want more custom & widing solutions, you can use this npm package

html2pdf: https://www.npmjs.com/package/html2pdf.js