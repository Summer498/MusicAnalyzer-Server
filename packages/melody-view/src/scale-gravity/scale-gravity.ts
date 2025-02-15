import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { ArrowController } from "../arrow/arrow";
import { ArrowModel } from "../arrow/arrow-model";

export const getScaleGravityController = (
  melody: IMelodyModel,
  i: number,
  melodies: IMelodyModel[],
  layer?: number
) => {
  const next = melodies.length <= i + 1 ? melodies[i] : melodies[i + 1];
  const res = [];
  const scale_gravity = melody.melody_analysis.scale_gravity;
  if (scale_gravity?.resolved && scale_gravity.destination !== undefined) {
    const svg = new ArrowController(
      new ArrowModel(melody, next, scale_gravity, layer),
    );
    res.push(svg);
  }
  return res;
};

