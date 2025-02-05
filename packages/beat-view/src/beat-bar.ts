import { SvgCollection } from "@music-analyzer/view";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { getRange } from "@music-analyzer/math";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { BeatBarController } from "./beat-bar-controller";

export const getBeatBars = (
  beat_info: BeatInfo,
  melodies: IMelodyModel[]
) => new SvgCollection(
  "beat-bars",
  getRange(
    0,
    Math.ceil(beat_info.tempo * melodies[melodies.length - 1].end) + beat_info.phase
  ).map(i => new BeatBarController(beat_info, i))
);
