export const getByteTimeDomainData = (analyser: AnalyserNode) => {
  const buffer_length = analyser.fftSize;
  const buffer = new Uint8Array(buffer_length);
  analyser.getByteTimeDomainData(buffer);
  return buffer;
}
