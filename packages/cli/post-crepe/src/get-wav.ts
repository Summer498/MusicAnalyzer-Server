import { WaveFile } from "wavefile";
export const getWav = (src: number[], SAMPLING_RATE: number) => {
  const wav = new WaveFile();
  wav.fromScratch(1, SAMPLING_RATE, "16", src);
  return wav.toBuffer();
};
