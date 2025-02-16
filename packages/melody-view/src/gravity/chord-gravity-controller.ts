import { ArrowController } from "../arrow/arrow";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { ArrowModel } from "../arrow/arrow-model";

export const getChordGravityController = (
  melody: IMelodyModel,
  i: number,
  melodies: IMelodyModel[],
  layer?: number
) => {
  const next = melodies.length <= i + 1 ? melodies[i] : melodies[i + 1];
  const res = [];
  const chord_gravity = melody.melody_analysis.chord_gravity;
  if (chord_gravity?.resolved && chord_gravity.destination !== undefined) {
    const svg = new ArrowController(
      new ArrowModel(melody, next, chord_gravity, layer),
    );
    res.push(svg);
  }
  return res;
};
