# jsPDF-html2canvas
A combine usage with jsPDF &amp; html2canvas, which translating html content to PDF file.

> html2PDF function will auto fit the target dom width into PDF size. So no need to worry about the overflow part. And if the content height is over 1 pdf, it'll auto seperate it into another pdf page.


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

since this plugin is an umd module, you can also use by cdn with `/dist/js-pdf.min.js`, just remember to include both `jspdf` & `html2canvas` cdn before this plugin.

```js
<script src="https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.7/dist/html2canvas.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jspdf-html2canvas@latest/dist/js-pdf.min.js"></script>
```


## html2PDF(DOM, options)

convert specific DOM target to print it into PDF file.

Automatically, it'll save the file, or you can define the success function to do with the jsPDF instance.

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

- **jsPDF**

setting for creating jsPDF's instance, please ref to [JSPDF Documentation](http://raw.githack.com/MrRio/jsPDF/master/docs/)

```js
let doc = new jsPDF(opts.jsPDF);
```

- **imageType**

define the target imageType, now only support for jpeg, png, webp

allowed value
  - `image/jpeg`
  - `image/png`
  - `image/webp`

```js
// will be used like
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
    unit: 'px',
    format: 'a4',
  },
  html2canvas: {
    imageTimeout: 15000,
    logging: true,
    useCORS: false,
  },
  imageType: 'image/jpeg',
  output: 'js.pdf', 
  success: function(pdf) {
    pdf.save(this.output);
  }
}
```


## Recommend

if you want more custom & widing solutions, you can use this npm package

html2pdf: https://www.npmjs.com/package/html2pdf.js