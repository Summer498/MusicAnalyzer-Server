class _Direction {
  direction: string;
  closure_degree: number;
  constructor(direction: string, closure_degree: number) {
    this.direction = direction;
    this.closure_degree = closure_degree;
  }
}

export type Direction = _Direction;
export const mL = new _Direction("mL", 1); // motion left (toward closure)
export const mN = new _Direction("mN", 0); // motion nil (no motion)
export const mR = new _Direction("mR", -1); // motion right (toward non-closure)
// NOTE: とりあえず closure degree を 1 と 2 にしているが、もっと細かな差異がありそう
