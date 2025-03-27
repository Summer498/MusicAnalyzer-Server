export const median = (array: number[]) => ((sorted, H) => (sorted[Math.floor(H)] + sorted[Math.ceil(H)]) / 2)(array.sort(), array.length / 2);
