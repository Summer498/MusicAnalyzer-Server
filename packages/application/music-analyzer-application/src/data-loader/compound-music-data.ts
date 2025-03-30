import { GTTMData } from "./facade";
import { ProlongationalReduction } from "./facade";
import { TimeSpanReduction } from "./facade";
import { getHierarchicalMelody } from "./facade";
import { AnalyzedMusicData } from "./facade";
import { TitleInfo } from "./facade";
import { DataContainer } from "./data-container";

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