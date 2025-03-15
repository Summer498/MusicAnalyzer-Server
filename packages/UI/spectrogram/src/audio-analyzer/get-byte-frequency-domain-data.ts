export const getByteFrequencyData = (analyser: AnalyserNode) => {
  const frequency_bin_count = analyser.frequencyBinCount;
  const buffer = new Uint8Array(frequency_bin_count);
  analyser.getByteFrequencyData(buffer);
  return buffer;
}
