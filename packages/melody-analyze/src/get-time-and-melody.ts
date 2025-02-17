import { compress } from "@music-analyzer/time-and";
import { TimeAndMelody } from "./interfaces";

const freqToMidi = (freq: number) => (Math.log2(freq) - Math.log2(440)) * 12 + 69;

export const getTimeAndMelody = (melody_data: number[], sampling_rate: number) => {
  const melody = melody_data.map(e => e || Math.round(freqToMidi(e)));
  const comp_melody = compress(melody);
  const non_null_melody = (() => {
    const res: TimeAndMelody[] = [];
    comp_melody.forEach(e => e.item || res.push({
      begin: e.begin / sampling_rate,
      end: e.end / sampling_rate,
      head: {
        begin: e.begin / sampling_rate,
        end: e.end / sampling_rate,
      },
      note: e.item
    })); // value が null の場合は time ごと除く
    return res;
  })();
  return non_null_melody;
};
