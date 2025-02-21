import { mod } from "@music-analyzer/math";
import { Gravity } from "./interfaces";
import { _Note, Chord, Scale } from "@music-analyzer/tonal-objects";

// TODO: マイナーコードに対応する
export const registerGravity = (pitch_class_set: Scale | Chord | undefined, curr?: number, next?: number) => {
  if (!pitch_class_set) { return undefined; }
  const name = pitch_class_set.name;
  const tonic = _Note.get(pitch_class_set.tonic || "").chroma;
  if (curr === undefined) { return undefined; }
  const chroma = mod(curr - tonic - (name.includes("major") ? 0 : 3), 12);
  const destination = chroma === 11 ? curr + 1 : chroma === 5 ? curr - 1 : undefined;
  if (destination === undefined) { return undefined; }
  return {
    destination,
    resolved: destination && next === destination || undefined
  } as Gravity;
};
