// DATA_SAMPLING_RATE 刻みのデータをサンプリング周波数に合わせる
export const getFrequency = (
  freq: number[],
  N: number
) => {
  return [freq.length * N]
    .map(e => Math.floor(e))
    .flatMap(e => new Array(e))
    .map((e, i) => i / N)
    .map(e => Math.floor(e))
    .map(e => freq[e])
    .map(e => 2 * 2 * Math.PI * e);
};
