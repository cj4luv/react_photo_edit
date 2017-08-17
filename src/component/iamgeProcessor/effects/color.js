/* eslint import/prefer-default-export: 0, no-param-reassign: 0, no-mixed-operators: 0, */

const floatDigit = (n, decimal) => parseFloat(n.toFixed(decimal));

const isInteger = n => Number.isInteger(n);

const isValidRGB = (colorCode) => {
  if (!isInteger(colorCode)) {
    return false;
  }
  return colorCode >= 0 && colorCode < 256;
};

const isValidFloat = (n) => {
  if (isNaN(n)) {
    return false;
  }
  return n >= 0 && n <= 1;
};

// @see https://en.wikipedia.org/wiki/Grayscale
export const grayscaleWithNTSC = (r, g, b) => r * 0.299 + g * 0.587 + b * 0.114;

// @see https://en.wikipedia.org/wiki/Relative_luminance
export const convertLuminanceLinearRGB = (r, g, b) => r * 0.2126 + g * 0.7152 + b * 0.0722;

export const binarize = (red, green, blue, threshold) => {
  const average = (red + green + blue) * 0.33;
  return (threshold >= average) ? 255 : 0;
};

export const identityLUT = () => {
  const lut = new Uint8Array(256);
  for (let i = 0; i < lut.length; i += 1) {
    lut[i] = i;
  }
  return lut;
};

export const applyLUT = (pix, lut) => {
  const newPix = Object.assign({}, pix);
  const { red, green, blue, alpha } = lut;
  const len = pix.length;
  for (let i = 0; i < len; i += 4) {
    pix[i] = red[newPix[i]];
    pix[i + 1] = green[newPix[i + 1]];
    pix[i + 2] = blue[newPix[i + 2]];
    pix[i + 3] = alpha[newPix[i + 3]];
  }
};

export const rgb2hex = (r, g, b) => {
  if (![r, g, b].every(isValidRGB)) {
    throw new Error('Invalid Color Code');
  }
  const hexify = v => parseInt(v, 10).toString(16);
  return [r, g, b].map(hexify).join('').toUpperCase();
};

export const hex2rgb = (hex) => {
  const rgb = hex.match(/[0-9a-zA-Z]{1,2}/g);
  return rgb.map((currentValue) => {
    const currentHex = parseInt(currentValue, 16);
    if (!isInteger(currentHex)) {
      throw new Error('Invalid hex code');
    }
    return currentHex;
  });
};

export const rgb2cmyk = (r, g, b) => {
  if (![r, g, b].every(isValidRGB)) {
    throw new Error('Invalid Color Code');
  }
  const max = Math.max(r, g, b);
  const delta = 255 - max;
  const c = (255 - r - delta) / (255 - delta);
  const m = (255 - g - delta) / (255 - delta);
  const y = (255 - b - delta) / (255 - delta);
  const k = floatDigit(delta / 255, 4);
  const normalize = n => isNaN(n) ? 0 : n; // eslint-disable-line no-confusing-arrow
  return [c, m, y, k].map(normalize);
};

export const cmyk2rgb = (c, m, y, k) => {
  if (![c, m, y, k].every(isValidFloat)) {
    throw new Error('Invalid CMYK Code');
  }
  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);
  return [r, g, b].map(Math.floor);
};

export const rgb2hsl = (red, green, blue) => {
  if (![red, green, blue].every(isValidRGB)) {
    throw new Error('Invalid Color Code');
  }
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  let h;
  let s;
  const isAchromatic = (max === min);
  if (isAchromatic) {
    h = s = 0;
  } else {
    const diff = max - min;
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
    switch (max) {
      case r:
        h = (g - b) / diff + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }
  return [h, s, l];
};

export const hsl2rgb = (h, s, l) => {
  if (![h, s, l].every(isValidFloat)) {
    throw new Error('Invalid HSL value');
  }
  const max = l + (s * (1 - Math.abs(2 * l - 1))) / 2;
  const min = l - (s * (1 - Math.abs(2 * l - 1))) / 2;
  const hue = h * 360;
  let rgb;
  if (hue >= 0 && hue < 60) {
    rgb = [max, min + (max - min) * hue / 60, min];
  } else if (hue >= 60 && hue < 120) {
    rgb = [min + (max - min) * (120 - hue) / 60, max, min];
  } else if (hue >= 120 && hue < 180) {
    rgb = [min, max, min + (max - min) * (hue - 120) / 60];
  } else if (hue >= 180 && hue < 240) {
    rgb = [min, min + (max - min) * (240 - hue) / 60, max];
  } else if (hue >= 240 && hue < 300) {
    rgb = [min + (max - min) * (hue - 240) / 60, min, max];
  } else if (hue >= 300 && hue < 360) {
    rgb = [max, min, min + (max - min) * (360 - hue) / 60];
  }
  return rgb.map(x => Math.round(x * 255));
};

export const rgb2hsv = (red, green, blue) => {
  let h;
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const v = max;

  const diff = max - min;
  const s = max === 0 ? 0 : diff / max;

  if (max === min) {
    // achromatic
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / diff + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }
  return [h, s, v];
};

export const hsv2rgb = (h, s, v) => {
  let r;
  let g;
  let b;

  const i = Math.floor(h * 6); // iterator
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
    default:
      break;
  }
  return [r * 255, g * 255, b * 255];
};

