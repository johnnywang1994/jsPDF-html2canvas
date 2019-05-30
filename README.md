# jsPDF-html2canvas
A combine usage with jsPDF &amp; html2canvas, which translating html content to PDF file.

Also contains chinese unicode font js files, which is made by jsPDF's ttf-file-converter.

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
    customFont: 'chinese'
  });
});
```

## options

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

- **customFont**

define customFont if needed, eg: chinese's unicode, must be used with importing the font's js module.

"chinese" font js file has been saved in modules folder, can be used directly.

refer: https://rawgit.com/MrRio/jsPDF/master/fontconverter/fontconverter.html

```js
pdf.setFont(opts.customFont);
```

- **output**

define name of the output PDF file

```js
pdf.save(opts.output);
```

- **success**

callback function to do after all code, default will save the file with the output name setting.
