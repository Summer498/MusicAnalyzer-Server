import { mod } from "@music-analyzer/math";
import { _Note } from "@music-analyzer/tonal-objects";
import { Chord } from "@music-analyzer/tonal-objects";
import { Scale } from "@music-analyzer/tonal-objects";
import { Gravity } from "./gravity";

// TODO: マイナーコードに対応する
export const registerGravity = (pitch_class_set: Scale | Chord | undefined, curr?: number, next?: number) => {
  if (!pitch_class_set) { return undefined; }
  const name = pitch_class_set.name;
  const tonic = _Note.get(pitch_class_set.tonic || "").chroma;
  if (curr === undefined) { return undefined; }
  const chroma = mod(curr - tonic - (name.includes("major") ? 0 : 3), 12);
  const destination = chroma === 11 ? curr + 1 : chroma === 5 ? curr - 1 : undefined;
  if (destination === undefined) { return undefined; }
  return new Gravity(
    destination,
    destination && next === destination || undefined
  );
};
