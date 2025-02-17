import { MusicXML } from "@music-analyzer/gttm";
import { GRP, MTR, TSR, PRR, D_TSR, D_PRR } from "@music-analyzer/gttm";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { getHierarchicalMelody } from "./HierarchicalMelody";
import { getJSON, getJSONfromXML } from "./DataFetcher";
import { MusicAnalyzer } from "./MusicAnalyzerWindow";

export const loadMusicAnalysis = async (
  tune_id: string,
  mode: "TSR" | "PR" | ""
): Promise<MusicAnalyzer> => {
  const tune_name = encodeURI(tune_id);
  const roman = await getJSON<TimeAndRomanAnalysis[]>(`/MusicAnalyzer-server/resources/${tune_name}/analyzed/chord/roman.json`)
    .then(res => res || []);
  const read_melody = await getJSON<IMelodyModel[]>(`/MusicAnalyzer-server/resources/${tune_name}/analyzed/melody/crepe/manalyze.json`)
    .then(res => res?.map(e => ({ ...e, head: { begin: e.begin, end: e.end } })) as IMelodyModel[]);
  const musicxml = await getJSONfromXML<MusicXML>(`/MusicAnalyzer-server/resources/gttm-example/${tune_name}/MSC-${tune_name}.xml`);
  const grouping = await getJSONfromXML<GRP>(`/MusicAnalyzer-server/resources/gttm-example/${tune_name}/GPR-${tune_name}.xml`);
  const metric = await getJSONfromXML<MTR>(`/MusicAnalyzer-server/resources/gttm-example/${tune_name}/MPR-${tune_name}.xml`);
  const time_span = await getJSONfromXML<D_TSR>(`/MusicAnalyzer-server/resources/gttm-example/${tune_name}/TS-${tune_name}.xml`);
  const prolongation = await getJSONfromXML<D_PRR>(`/MusicAnalyzer-server/resources/gttm-example/${tune_name}/PR-${tune_name}.xml`);

  const ts = time_span ? new TSR(time_span).tstree.ts : undefined;
  const pr = prolongation ? new PRR(prolongation).prtree.pr : undefined;

  const hierarchical_melody = (() => {
    if (musicxml && ts) {
      const matrix = ts.getMatrixOfLayer(ts.getDepthCount() - 1);
      const measure = tune_id === "doremi" ? 3.5 : 7;
      if (mode === "PR") {
        if (pr) { return getHierarchicalMelody(measure, pr, matrix, musicxml, roman); }
        else { return []; }
      }
      else if (mode === "TSR") { return getHierarchicalMelody(measure, ts, matrix, musicxml, roman); }
      else { return []; }
    }
    else {
      return [read_melody];
    }
  })();

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
  };
};