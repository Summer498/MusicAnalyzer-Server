import { rgbToString } from "@music-analyzer/color";
import { HierarchyLevel } from "@music-analyzer/controllers";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { ArrowController } from "../arrow/arrow";
import { Controller } from "@music-analyzer/view";
import { ArrowModel } from "../arrow/arrow-model";

// TODO: chord gravities と key gravities を別オブジェクトとして得られるようにする
export const key_gravities: SVGElement[] = [];

export const getScaleGravityController = (
  melody: IMelodyModel,
  i: number,
  melodies: IMelodyModel[],
  hierarchy_level: HierarchyLevel,
  layer?: number
): Controller[] => {
  const stroke = rgbToString([0, 0, 0]);
  const next = melodies.length <= i + 1 ? melodies[i] : melodies[i + 1];
  const fill = rgbToString([0, 0, 0]);
  const res: Controller[] = [];
  const scale_gravity = melody.melody_analysis.scale_gravity;
  if (scale_gravity?.resolved && scale_gravity.destination !== undefined) {
    const svg = new ArrowController(
      new ArrowModel(melody, next, scale_gravity, hierarchy_level, layer),
      fill, stroke,
    );
    res.push(svg);
    key_gravities.push(svg.view.svg);
  }
  return res;
};

