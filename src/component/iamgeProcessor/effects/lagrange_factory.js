import Lagrange from './lagrange';

export default class LagrangeFactory {
  static build() {
    return new Lagrange(0, 0, 1, 1);
  }

  static buildWithPoints(points) {
    const l = this.build();
    l.addPoints(points);
    return l;
  }
}
