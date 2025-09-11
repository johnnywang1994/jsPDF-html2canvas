import type {ImagesType} from '../types'

const types: Record<ImagesType, string> = {
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'image/webp': 'WEBP'
};

const images = function(type: ImagesType) {
  return types[type];
};

export default images;
