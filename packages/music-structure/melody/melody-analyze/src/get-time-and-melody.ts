import { compress } from "@music-analyzer/time-and";
import { createTimeAndMelody } from "./time-and-melody";

const freqToMidi = (freq: number) => (Math.log2(freq) - Math.log2(440)) * 12 + 69;

export const getTimeAndMelody = (melody_data: number[], sampling_rate: number) => {
  const melody = melody_data.map(e => e || Math.round(freqToMidi(e)));
  const comp_melody = compress(melody);
  const non_null_melody = comp_melody.map(e => {
    const time = e.time.map(e => e / sampling_rate);
    return createTimeAndMelody(
      time,
      time,
      e.item,
    );
  }).filter(e => e.note);
  return non_null_melody;
};
