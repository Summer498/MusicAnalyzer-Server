class _Magnitude {
  magnitude: string;
  closure_degree: number;
  constructor(magnitude: string, closure_degree: number) {
    this.magnitude = magnitude;
    this.closure_degree = closure_degree;
  }
}

export type Magnitude = _Magnitude;
export const AA = new _Magnitude("AA", 1); // similar
export const AB = new _Magnitude("AB", 2); // different
// NOTE: とりあえず closure degree を 1 と 2 にしているが、もっと細かな差異がありそう
