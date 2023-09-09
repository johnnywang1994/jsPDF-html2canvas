import { Options, PdfInstance } from '../types';
import useWaterMark from '../plugins/useWaterMark';

async function usePlugins(pdfInstance: PdfInstance, opts: Options) {
  // check watermark
  if (!!opts.watermark) {
    await useWaterMark(pdfInstance, opts);
  }
}

export default usePlugins;
