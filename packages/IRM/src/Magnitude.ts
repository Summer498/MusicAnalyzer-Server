class _Magnitude {
  name: string;
  closure_degree: number;
  constructor(name: string, closure_degree: number) {
    this.name = name;
    this.closure_degree = closure_degree;
  }
}

export type Magnitude = _Magnitude;
export const AA = new _Magnitude("AA", 1); // similar
export const AB = new _Magnitude("AB", 2); // different
// NOTE: とりあえず closure degree を 1 と 2 にしているが、もっと細かな差異がありそう
