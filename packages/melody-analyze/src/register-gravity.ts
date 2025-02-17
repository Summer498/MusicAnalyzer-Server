import { mod } from "@music-analyzer/math";
import { Gravity, TimeAndMelody } from "./interfaces";

// TODO: マイナーコードに対応する
export const registerGravity = (
  name: string,
  tonic: number,
  melodies: TimeAndMelody[],
  i: number
): Gravity | undefined => {
  if (!name) { return undefined; }
  const pitch = melodies[i].note;
  if (pitch === undefined) { return undefined; }
  const chroma = mod(pitch - tonic - (name.includes("major") ? 0 : 3), 12);
  const destination = chroma === 11 ? pitch + 1 : chroma === 5 ? pitch - 1 : undefined;
  if (destination === undefined) { return undefined; }
  return {
    destination,
    resolved: destination && i + 1 < melodies.length && melodies[i + 1].note === destination || undefined
  };
};
