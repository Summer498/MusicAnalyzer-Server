export const getFreqFromPhase = (frequency: number[]) => {
  const phase = [...frequency];
  frequency.reduce((p, c, i) => {
    phase[i] = p;
    return p + c;
  })
  return phase
}