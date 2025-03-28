import { mod } from "@music-analyzer/math/src/basic-function/mod";
import { Chord } from "@music-analyzer/tonal-objects/src/chord/chord";
import { getNote } from "@music-analyzer/tonal-objects/src/note/get";
import { Scale } from "@music-analyzer/tonal-objects/src/scale/scale";
import { Gravity } from "./gravity";

// TODO: マイナーコードに対応する
export const registerGravity = (pitch_class_set: Scale | Chord | undefined, curr?: number, next?: number) => {
  if (!pitch_class_set) { return undefined; }
  const name = pitch_class_set.name;
  const tonic = getNote(pitch_class_set.tonic || "").chroma;
  if (curr === undefined) { return undefined; }
  const chroma = mod(curr - tonic - (name.includes("major") ? 0 : 3), 12);
  const destination = chroma === 11 ? curr + 1 : chroma === 5 ? curr - 1 : undefined;
  if (destination === undefined) { return undefined; }
  return new Gravity(
    destination,
    destination && next === destination || undefined
  );
};
