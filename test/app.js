new Vue({
  el: '#app',
  data: function() {
    return {
      runningKey: '',
      scenarios: [
        {
          key: 'single',
          title: 'Scenario 1: default single node',
          description: 'Baseline rendering with zero margin so you can compare against the margin scenarios.',
          targetId: 'single-node',
          fileName: 'single-node-baseline.pdf',
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
          imageType: 'image/jpeg',
          result: 'Waiting for generation...',
          pdfUrl: '',
        },
        {
          key: 'margin',
          title: 'Scenario 2: margin handling',
          description: 'Uses asymmetric margins to verify the captured page has the expected whitespace around the content.',
          targetId: 'margin-node',
          fileName: 'margin-check.pdf',
          margin: { top: 30, right: 20, bottom: 42, left: 24 },
          imageType: 'image/jpeg',
          result: 'Waiting for generation...',
          pdfUrl: '',
        },
        {
          key: 'multi',
          title: 'Scenario 3: multi node + margin',
          description: 'Passes a node list and uses the same margin settings so multi-page behavior stays covered.',
          targetId: 'multi-nodes',
          fileName: 'multi-node-margin.pdf',
          margin: { top: 30, right: 20, bottom: 30, left: 20 },
          imageType: 'image/png',
          result: 'Waiting for generation...',
          pdfUrl: '',
        },
        {
          key: 'watermark',
          title: 'Scenario 4: watermark preview',
          description: 'Uses the local test.png asset so the demo also covers watermark image loading.',
          targetId: 'watermark-node',
          fileName: 'watermark-sample.pdf',
          margin: { top: 16, right: 16, bottom: 16, left: 16 },
          imageType: 'image/jpeg',
          watermark: {
            src: './test.png',
            scale: 2
          },
          result: 'Waiting for generation...',
          pdfUrl: '',
        },
        {
          key: 'issue40',
          title: 'Scenario 5: issue #40 margin repro',
          description: 'Long content with a heavier bottom margin so you can inspect whether the page transition keeps the expected spacing.',
          targetId: 'issue40-node',
          fileName: 'issue-40-margin-repro.pdf',
          margin: { top: 30, right: 20, bottom: 60, left: 20 },
          imageType: 'image/jpeg',
          result: 'Waiting for generation...',
          pdfUrl: '',
        },
      ],
    };
  },
  methods: {
    describeMargin: function(margin) {
      return `top=${margin.top}, right=${margin.right}, bottom=${margin.bottom}, left=${margin.left}`;
    },
    setScenarioResult: function(scenario, message, pdfUrl) {
      scenario.result = message;
      scenario.pdfUrl = pdfUrl || '';
    },
    buildConfig: function(scenario) {
      return {
        output: scenario.fileName,
        margin: scenario.margin,
        imageType: scenario.imageType,
        html2canvas: {
          scrollX: 0,
          scrollY: 0,
          useCORS: true,
        },
        watermark: scenario.watermark,
        success: function() {},
      };
    },
    getPageCount: function(pdf) {
      if (typeof pdf.getNumberOfPages === 'function') {
        return pdf.getNumberOfPages();
      }
      return pdf.internal.getNumberOfPages();
    },
    generatePdf: async function(scenario) {
      if (this.runningKey) {
        return;
      }

      this.runningKey = scenario.key;
      this.setScenarioResult(scenario, 'Generating PDF...', '');

      try {
        var target = document.getElementById(scenario.targetId);
        var pdf = await html2PDF(target, this.buildConfig(scenario));
        var pageCount = this.getPageCount(pdf);
        var pdfUrl = pdf.output('bloburl');

        this.setScenarioResult(
          scenario,
          [
            `Generated: ${scenario.fileName}`,
            `Pages: ${pageCount}`,
            `Margin: ${this.describeMargin(scenario.margin)}`,
            `Image type: ${scenario.imageType}`,
          ].join('\n'),
          pdfUrl,
        );
      } catch (error) {
        console.error(error);
        this.setScenarioResult(
          scenario,
          `Generation failed: ${error && error.message ? error.message : error}`,
          '',
        );
      } finally {
        this.runningKey = '';
      }
    },
  },
});
