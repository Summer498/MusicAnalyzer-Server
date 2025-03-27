// 正規乱数を生成
export const normal_rand = (m: number, s: number) => {
  const r = Math.sqrt(-2 * Math.log(Math.random()));
  const t = 2 * Math.PI * Math.random();
  return [r * Math.cos(t), r * Math.sin(t)];
};
