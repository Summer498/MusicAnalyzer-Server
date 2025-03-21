import { WaveFile } from "wavefile";
import { SAMPLING_RATE } from "./util";

export const getWav = (src: number[]) => {
  const wav = new WaveFile();
  wav.fromScratch(1, SAMPLING_RATE, "16", src);
  return wav.toBuffer();
};
