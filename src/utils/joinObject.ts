function isObject(v: unknown) {
  return v !== null && typeof v === 'object';
}

function isFn(v: unknown) {
  return typeof v === 'function';
}

export default function joinObject<T>(obj1: any, obj2: any): T {
  for (let i = 0, keys = Object.keys(obj1); i < keys.length; i++) {
    const key = keys[i];
    if (key in obj2) {
      const isObject_1 = isObject(obj1[key]);
      const isObject_2 = isObject(obj2[key]);
      if (isObject_1 && isObject_2) {
        if (isFn(obj1[key]) && isFn(obj2[key])) {
          // both are functions, replace
          obj1[key] = obj2[key];
        } else if (isFn(obj1[key]) && !isFn(obj2[key])) {
          console.error(`[jspdf-html2canvas] config key "${key}" type invalid`);
        } else {
          obj1[key] = joinObject(obj1[key], obj2[key]);
        }
      } else if (isObject_2) {
        obj2[key].old = obj1[key];
        obj1[key] = obj2[key];
      } else if (isObject_1) {
        obj1[key].new = obj2[key];
      } else {
        obj1[key] = obj2[key];
      }
      delete obj2[key];
    }
  }
  return Object.assign(obj1, obj2);
}