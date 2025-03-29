export const getFloatTimeDomainData = (analyser: AnalyserNode) => {
  const buffer_length = analyser.fftSize;
  const buffer = new Float32Array(buffer_length);
  analyser.getFloatTimeDomainData(buffer);
  return buffer;
}
