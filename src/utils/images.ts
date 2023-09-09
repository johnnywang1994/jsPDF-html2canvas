const types: Record<string, string> = {
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'image/webp': 'WEBP'
};

const images = function(type: string) {
  return types[type];
};

export default images;
