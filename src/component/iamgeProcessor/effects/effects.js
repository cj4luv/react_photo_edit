import LagrangeFactory from './lagrange_factory';
import lagrangeRgbMap from './rgb_map';
import * as color from './color';

/* eslint import/prefer-default-export: 0, no-param-reassign: 0 */

export const enhance = ({ data }) => {
  for (let i = 0, n = data.length; i < n; i += 4) {
    data[i] *= 1.24;
    data[i + 1] *= 1.33;
    data[i + 2] *= 1.21;
  }
};

export const grayscale = ({ data }) => {
  for (let i = 0, n = data.length; i < n; i += 4) {
    const scale = color.grayscaleWithNTSC(data[i], data[i + 1], data[i + 1]);
    data[i] = scale;
    data[i + 1] = scale;
    data[i + 2] = scale;
  }
};

export const sepia = ({ data }) => {
  for (let i = 0, n = data.length; i < n; i += 4) {
    data[i] *= 1.07;
    data[i + 1] *= 0.74;
    data[i + 2] *= 0.43;
  }
};

export const luminance = ({ data }) => {
  for (let i = 0, n = data.length; i < n; i += 4) {
    const luminanceScale = color.convertLuminanceLinearRGB(data[i], data[i + 1], data[i + 2]);
    data[i] = luminanceScale;
    data[i + 1] = luminanceScale;
    data[i + 2] = luminanceScale;
  }
};

export const negaposi = ({ data }) => {
  for (let i = 0, n = data.length; i < n; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
};

export const opacity = ({ data }, options = {}) => {
  const val = options.value || 0.5;
  for (let i = 0, n = data.length; i < n; i += 4) {
    data[i + 3] = data[i + 3] * val;
  }
};

export const brighten = ({ data }, options = {}) => {

  // const val = options.value || 50;
  const val = options.value;
  // console.log('brighten', val, 'data',data)
  for (let i = 0, n = data.length; i < n; i += 4) {
    data[i] += val;
    data[i + 1] += val;
    data[i + 2] += val;
  }
};

export const darken = ({ data }, options = {}) => {
  const val = options.value || 50;
  for (let i = 0, n = data.length; i < n; i += 4) {
    data[i] -= val;
    data[i + 1] -= val;
    data[i + 2] -= val;
  }
};

export const threshold = ({ data }) => {
  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const thresholdScale = color.grayscaleWithNTSC(r, g, b);
    const bw = color.binarize(r, g, b, thresholdScale);
    data[i] = bw;
    data[i + 1] = bw;
    data[i + 2] = bw;
  }
};

export const hueRotate = ({ data }, options = {}) => {
  const deg = options.degree || 45;
  for (let i = 0, n = data.length; i < n; i += 4) {
    const hsv = color.rgb2hsv(data[i], data[i + 1], data[i + 2]);
    hsv[0] *= deg / 360;
    const rgb = color.hsv2rgb(hsv[0], hsv[1], hsv[2]);
    data[i] = rgb[0];
    data[i + 1] = rgb[1];
    data[i + 2] = rgb[2];
  }
};

export const saturate = ({ data }, options = {}) => {
  const val = options.value || 50;
  for (let i = 0, n = data.length; i < n; i += 4) {
    const hsv = color.rgb2hsv(data[i], data[i + 1], data[i + 2]);
    hsv[1] *= val / 100;
    const rgb = color.hsv2rgb(hsv[0], hsv[1], hsv[2]);
    data[i] = rgb[0];
    data[i + 1] = rgb[1];
    data[i + 2] = rgb[2];
  }
};

export const brightnessContrast = ({ data }, options = {}) => {
  const brightness = options.brightness || -0.08;
  const contrast = options.contrast || 1.5;
  const contrastAdjust = (-128 * contrast) + 128;
  const brightnessAdjust = 255 * brightness;
  const adjust = contrastAdjust + brightnessAdjust;
  const lut = new Uint8Array(256);
  const len = lut.length;
  for (let i = 0; i < len; i += 1) {
    const c = (i * contrast) + adjust;
    if (c < 0) {
      lut[i] = 0;
    } else {
      lut[i] = (c > 255) ? 255 : c;
    }
  }
  return color.applyLUT(data,
    {
      red: lut,
      green: lut,
      blue: lut,
      alpha: color.identityLUT(),
    },
  );
};

export const horizontalFlip = ({ data, width, height }) => {
  const newPix = Object.assign([], data);
  for (let i = 0; i < height; i += 1) {
    const w = i * width;
    for (let j = 0; j < width; j += 1) {
      const off = (w + j) * 4;
      const dstOff = (w + (width - j - 1)) * 4;
      data[dstOff] = newPix[off];
      data[dstOff + 1] = newPix[off + 1];
      data[dstOff + 2] = newPix[off + 2];
      data[dstOff + 3] = newPix[off + 3];
    }
  }
};

export const verticalFlip = ({ data, width, height }) => {
  const newPix = Object.assign([], data);
  for (let i = 0; i < height; i += 1) {
    for (let j = 0; j < width; j += 1) {
      const off = ((i * width) + j) * 4;
      const dstOff = (((height - i - 1) * width) + j) * 4;
      data[dstOff] = newPix[off];
      data[dstOff + 1] = newPix[off + 1];
      data[dstOff + 2] = newPix[off + 2];
      data[dstOff + 3] = newPix[off + 3];
    }
  }
};

export const doubleFlip = ({ data }) => {
  const newPix = Object.assign([], data);
  for (let i = 0, n = data.length; i < n; i += 4) {
    const k = n - i;
    data[i] = newPix[k];
    data[i + 1] = newPix[k + 1];
    data[i + 2] = newPix[k + 2];
    data[i + 3] = newPix[k + 3];
  }
};

export const horizontalMirror = ({ data, width, height }) => {
  for (let i = 0; i < height; i += 1) {
    const k = i * width;
    for (let j = 0; j < width; j += 1) {
      const off = (k + j) * 4;
      const dstOff = (k + (width - j - 1)) * 4;
      data[dstOff] = data[off];
      data[dstOff + 1] = data[off + 1];
      data[dstOff + 2] = data[off + 2];
      data[dstOff + 3] = data[off + 3];
    }
  }
};

export const verticalMirror = ({ data, width, height }) => {
  for (let i = 0; i < height; i += 1) {
    for (let j = 0; j < width; j += 1) {
      const off = ((i * width) + j) * 4;
      const dstOff = (((height - i - 1) * width) + j) * 4;
      data[dstOff] = data[off];
      data[dstOff + 1] = data[off + 1];
      data[dstOff + 2] = data[off + 2];
      data[dstOff + 3] = data[off + 3];
    }
  }
};

export const XYMirror = ({ data }) => {
  for (let i = 0, n = data.length; i < n; i += 4) {
    const k = n - i;
    data[i] = data[k];
    data[i + 1] = data[k + 1];
    data[i + 2] = data[k + 2];
    data[i + 3] = data[k + 3];
  }
};

const applyInstagramFilter = (filterType, data) => {
  const rgbMap = lagrangeRgbMap[filterType];
  const lagrangeR = LagrangeFactory.buildWithPoints(rgbMap.r);
  const lagrangeG = LagrangeFactory.buildWithPoints(rgbMap.g);
  const lagrangeB = LagrangeFactory.buildWithPoints(rgbMap.b);
  for (let i = 0, n = data.length; i < n; i += 4) {
    data[i] = lagrangeR.valueOf(data[i]);
    data[i + 1] = lagrangeB.valueOf(data[i + 1]);
    data[i + 2] = lagrangeG.valueOf(data[i + 2]);
  }
};
export const lark = ({ data }) => applyInstagramFilter('lark', data);
export const reyes = ({ data }) => applyInstagramFilter('reyes', data);
export const juno = ({ data }) => applyInstagramFilter('juno', data);
export const slumber = ({ data }) => applyInstagramFilter('slumber', data);
export const crema = ({ data }) => applyInstagramFilter('crema', data);
export const ludwig = ({ data }) => applyInstagramFilter('ludwig', data);
export const aden = ({ data }) => applyInstagramFilter('aden', data);
export const perpetua = ({ data }) => applyInstagramFilter('perpetua', data);
export const amaro = ({ data }) => applyInstagramFilter('amaro', data);
export const mayfair = ({ data }) => applyInstagramFilter('mayfair', data);
export const rise = ({ data }) => applyInstagramFilter('rise', data);
export const hudson = ({ data }) => applyInstagramFilter('hudson', data);
export const valencia = ({ data }) => applyInstagramFilter('valencia', data);
export const xpro2 = ({ data }) => applyInstagramFilter('xpro2', data);
export const sierra = ({ data }) => applyInstagramFilter('sierra', data);
export const willow = ({ data }) => applyInstagramFilter('willow', data);
export const lofi = ({ data }) => applyInstagramFilter('lofi', data);
export const earlybird = ({ data }) => applyInstagramFilter('earlybird', data);
export const brannan = ({ data }) => applyInstagramFilter('brannan', data);
export const hefe = ({ data }) => applyInstagramFilter('hefe', data);
export const nashville = ({ data }) => applyInstagramFilter('nashville', data);
export const sutro = ({ data }) => applyInstagramFilter('sutro', data);
export const toaster = ({ data }) => applyInstagramFilter('toaster', data);
export const walden = ({ data }) => applyInstagramFilter('walden', data);
export const nineteenSeventySeven = ({ data }) => applyInstagramFilter('nineteenSeventySeven', data);
export const kelvin = ({ data }) => applyInstagramFilter('kelvin', data);
export const inkwell = ({ data }) => {
  for (let i = 0, n = data.length; i < n; i += 4) {
    const val = (data[i] * 0.33) + (data[i + 1] * 0.58) + (data[i + 2] * 0.22);
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
  }
};
