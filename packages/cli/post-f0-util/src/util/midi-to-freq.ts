export const midi2freq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);
