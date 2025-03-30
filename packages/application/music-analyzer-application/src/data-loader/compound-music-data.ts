import { GTTMData } from "@music-analyzer/gttm";
import { ProlongationalReduction } from "@music-analyzer/gttm";
import { TimeSpanReduction } from "@music-analyzer/gttm";
import { getHierarchicalMelody } from "@music-analyzer/melody-hierarchical-analysis";
import { DataContainer } from "./data-container";
import { AnalyzedMusicData } from "../MusicAnalyzerWindow";
import { TitleInfo } from "../containers/tune-info";

export const compoundMusicData = (title:TitleInfo) => (e: DataContainer) => {
  const [roman, read_melody, musicxml, grouping, metric, time_span, prolongation] = e;

  const ts = time_span ? new TimeSpanReduction(time_span).tstree.ts : undefined;
  const pr = prolongation ? new ProlongationalReduction(prolongation).prtree.pr : undefined;

  const measure = title.id === "doremi" ? 3.5 : 7;
  const reduction = title.mode === "PR" && pr || title.mode === "TSR" && ts;
  const matrix = ts?.getMatrixOfLayer(ts.getDepthCount() - 1);
  const hierarchical_melody = reduction && matrix && musicxml && getHierarchicalMelody(measure, reduction, matrix, musicxml, roman) || [read_melody];

  const melody = hierarchical_melody[hierarchical_melody.length - 1];
  return new AnalyzedMusicData(
    roman,
    melody,
    hierarchical_melody,
    new GTTMData(grouping, metric, time_span, prolongation,)
  );
};