import { GroupingStructure, IProlongationalReduction, ITimeSpanReduction, MetricalStructure, MusicXML, ProlongationalReduction, TimeSpanReduction } from "@music-analyzer/gttm";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { getHierarchicalMelody } from "./HierarchicalMelody";
import { getJSON, getJSONfromXML } from "./DataFetcher";
import { AnalyzedMusicData } from "./MusicAnalyzerWindow";

const justLoad = (tune_name: string) => {
  return [
    getJSON<TimeAndRomanAnalysis[]>(`/MusicAnalyzer-server/resources/${tune_name}/analyzed/chord/roman.json`)
      .then(res => res || []),
    getJSON<IMelodyModel[]>(`/MusicAnalyzer-server/resources/${tune_name}/analyzed/melody/crepe/manalyze.json`)
      .then(res => res?.map(e => ({ ...e, head: { begin: e.begin, end: e.end } })) as IMelodyModel[]),
    getJSONfromXML<MusicXML>(`/MusicAnalyzer-server/resources/gttm-example/${tune_name}/MSC-${tune_name}.xml`),
    getJSONfromXML<GroupingStructure>(`/MusicAnalyzer-server/resources/gttm-example/${tune_name}/GPR-${tune_name}.xml`),
    getJSONfromXML<MetricalStructure>(`/MusicAnalyzer-server/resources/gttm-example/${tune_name}/MPR-${tune_name}.xml`),
    getJSONfromXML<ITimeSpanReduction>(`/MusicAnalyzer-server/resources/gttm-example/${tune_name}/TS-${tune_name}.xml`),
    getJSONfromXML<IProlongationalReduction>(`/MusicAnalyzer-server/resources/gttm-example/${tune_name}/PR-${tune_name}.xml`),
  ] as [
      Promise<TimeAndRomanAnalysis[]>,
      Promise<IMelodyModel[]>,
      Promise<MusicXML | undefined>,
      Promise<GroupingStructure | undefined>,
      Promise<MetricalStructure | undefined>,
      Promise<ITimeSpanReduction | undefined>,
      Promise<IProlongationalReduction | undefined>,
    ];
};

export const loadMusicAnalysis = (
  tune_id: string,
  mode: "TSR" | "PR" | ""
) => {
  return Promise.all(justLoad(encodeURI(tune_id)))
    .then(e => {
      const [roman, read_melody, musicxml, grouping, metric, time_span, prolongation] = e;

      const ts = time_span ? new TimeSpanReduction(time_span).tstree.ts : undefined;
      const pr = prolongation ? new ProlongationalReduction(prolongation).prtree.pr : undefined;

      const measure = tune_id === "doremi" ? 3.5 : 7;
      const reduction = mode === "PR" && pr || mode === "TSR" && ts;
      const matrix = ts?.getMatrixOfLayer(ts.getDepthCount() - 1);
      const hierarchical_melody = reduction && matrix && musicxml && getHierarchicalMelody(measure, reduction, matrix, musicxml, roman) || [read_melody];

      const melody = hierarchical_melody[hierarchical_melody.length - 1];
      return {
        roman,
        melody,
        hierarchical_melody,
        GTTM: {
          grouping,
          metric,
          time_span,
          prolongation,
        },
      } as AnalyzedMusicData;
    });
};