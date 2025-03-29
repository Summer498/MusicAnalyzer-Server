export const freq2midi = (freq: number) => 12 * (Math.log2(freq) - Math.log2(440)) + 69;
