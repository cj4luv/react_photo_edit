/**
 * @see https://gist.github.com/dburner/8550030
 * @see http://jsfiddle.net/maccesch/jgU3Y/
 */
export default class Lagrange {

  constructor(x1, y1) {
    this.xs = [x1];
    this.ys = [y1];
    this.ws = [];
    this.weightsUpdated = false;
  }

  /**
   * Adds a new point to the polynomial. L(x) = y
   */
  addPoint(x, y) {
    this.xs.push(x);
    this.ys.push(y);
    this.weightsUpdated = false;
  }

  addPoints(arr) {
    const len = arr.length;
    for (let i = 0; i < len; i += 1) {
      if (arr[i][0] !== 0 && arr[i][0] !== 1) {
        this.addPoint(arr[i][1], arr[i][2]);
      }
    }
    this.weightsUpdated = false;
  }

  /**
   * Recalculate barycentric weights.
   */
  updateWeights() {
    const len = this.xs.length;
    let weight;
    for (let j = 0; j < len; j += 1) {
      weight = 1;
      for (let i = 0; i < len; i += 1) {
        if (i !== j) {
          weight *= this.xs[j] - this.xs[i];
        }
      }
      this.ws[j] = 1 / weight;
    }
    this.weightsUpdated = true;
  }

  /**
   * Calculate L(x)
   */
  valueOf(x) {
    if (!this.weightsUpdated) {
      this.updateWeights();
    }
    let a = 0;
    let b = 0;
    let c = 0;
    const len = this.xs.length;
    for (let j = 0; j < len; j += 1) {
      if (x !== this.xs[j]) {
        a = this.ws[j] / (x - this.xs[j]);
        b += a * this.ys[j];
        c += a;
      } else {
        return this.ys[j];
      }
    }
    return b / c;
  }
}
