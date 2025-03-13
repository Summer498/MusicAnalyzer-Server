const _hhmmLogViterbi = <O, S>(
  q: S[][]
) => {
  /*
  const delta: number[][][][] = [];
  const psi: number[][][][][] = [];
  const tau: number[][][][] = [];
  
  // production states
  // 1. initialization
  delta[0][t][D][i] = pi(q[D-1])(q[D][i]) * b(q[D][i])(o[t]);
  psi[0][t][D][i] = 0;
  tau[0][t][D][i] = t;
  // 2. recursion
  const max = argsMinMax(j => delta[k][t][D][j] * a(q[D-1])[j][i] * b(q[D][i])(o[t+k]), getRange(0, q[D-1].length), findMax);
  delta[k][t][D][i] = max.val;
  psi[k][t][D][i] = max.args;
  tau[k][t][D][i] = t + k;

  // internal states
  // 1. initialization
  delta[0][t][d][i] = minMax(j => pi(q[d-1])(q[d][i]) * delta[0][t][d+1], getRange(0, q[d]), findMax);
  */
};
