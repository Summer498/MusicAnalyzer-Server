import { getRange } from "../array";

export const matTrans = (matrix: number[][]) => getRange(0, matrix[0].length).map(i => getRange(0, matrix.length).map(j => matrix[j][i]),);
