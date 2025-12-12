import type { jsPDF, jsPDFOptions } from 'jspdf';
import type { Options as Html2CanvasOptions } from 'html2canvas-pro';

type WaterMarkHandlerParam = {
  pdf: jsPDF;
  pageNumber: number;
  totalPageNumber: number;
  imgNode: HTMLImageElement;
}

// allow string | function | object
type WaterMarkOptions = {
  scale: number;
  src?: string;
  handler?: (param: WaterMarkHandlerParam) => void;
} | ((param: Omit<WaterMarkHandlerParam, 'imgNode'>) => void) | string;

// allowed image types
export type ImagesType = 'image/jpeg' |'image/png' |'image/webp'

export interface Options {
  jsPDF: Partial<jsPDFOptions>;
  html2canvas: Partial<Html2CanvasOptions>;
  margin: {
    right: number;
    top: number;
    bottom: number;
    left: number;
  };
  imageType: ImagesType;
  imageQuality: number;
  output: string;
  autoResize: boolean;
  watermarkImg?: HTMLImageElement; // used inside plugin
  watermark?: WaterMarkOptions;
  init: (this: Options, pdf: jsPDF) => Promise<void> | void;
  success: (pdf: jsPDF) => Promise<void> | void;
}

export interface PdfInstance {
  pdf: jsPDF;
  pdfWidth: number;
  pdfHeight: number;
  pdfContentWidth: number;
  pdfContentHeight: number;
  position: number; // page's start position
  currentPage: number; // current page number of total pdf
  pageOfCurrentNode: number; // current page of current node
}

export type jsPDFInternal = jsPDF['internal'] & {
  getNumberOfPages: () => number;
}