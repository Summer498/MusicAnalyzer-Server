import { GroupingStructure, IProlongationalReduction, ITimeSpanReduction, MetricalStructure, ProlongationalReduction, TimeSpanReduction } from "@music-analyzer/gttm";
import { getHierarchicalMelody } from "@music-analyzer/melody-hierarchical-analysis";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MusicXML } from "@music-analyzer/musicxml";
import { getJSON, getJSONfromXML } from "./DataFetcher";
import { AnalyzedMusicData, GTTMData } from "./MusicAnalyzerWindow";
import { Time } from "@music-analyzer/time-and";

const registerSong = (urls: string[], audio_player: HTMLAudioElement | HTMLVideoElement) => {
  const url = urls.pop();
  if (!url) {
    audio_player.src = "/MusicAnalyzer-server/resources/Hierarchical Analysis Sample/sample1.mp4";
    return;
  }

  audio_player.muted = false;
  audio_player.src = url;
  audio_player.onerror = () => {
    audio_player.muted = true;
    registerSong(urls, audio_player);
  };
};

export const setAudioPlayer = (tune_name: string, audio_player: HTMLAudioElement | HTMLVideoElement) => {
  const filename = `/MusicAnalyzer-server/resources/${tune_name}/${tune_name}`;
  const extensions = ["mp3", "mp4", "wav", "m4a"];
  registerSong(extensions.map(e => `${filename}.${e}`), audio_player);
};

type DataPromises = [
  Promise<TimeAndRomanAnalysis[]>,
  Promise<TimeAndAnalyzedMelody[]>,
  Promise<MusicXML | undefined>,
  Promise<GroupingStructure | undefined>,
  Promise<MetricalStructure | undefined>,
  Promise<ITimeSpanReduction | undefined>,
  Promise<IProlongationalReduction | undefined>,
];

const justLoad = (tune_name: string) => {
  return [
    getJSON<TimeAndRomanAnalysis[]>(`/MusicAnalyzer-server/resources/${tune_name}/analyzed/chord/roman.json`)
      .then(res => res || []),
    getJSON<TimeAndAnalyzedMelody[]>(`/MusicAnalyzer-server/resources/${tune_name}/analyzed/melody/crepe/manalyze.json`)
      .then(res => res?.map(e => ({ ...e, head: new Time(e.begin, e.end) })) as TimeAndAnalyzedMelody[]),
    getJSONfromXML<MusicXML>(`/MusicAnalyzer-server/resources/gttm-example/${tune_name}/MSC-${tune_name}.xml`),
    getJSONfromXML<GroupingStructure>(`/MusicAnalyzer-server/resources/gttm-example/${tune_name}/GPR-${tune_name}.xml`),
    getJSONfromXML<MetricalStructure>(`/MusicAnalyzer-server/resources/gttm-example/${tune_name}/MPR-${tune_name}.xml`),
    getJSONfromXML<ITimeSpanReduction>(`/MusicAnalyzer-server/resources/gttm-example/${tune_name}/TS-${tune_name}.xml`),
    getJSONfromXML<IProlongationalReduction>(`/MusicAnalyzer-server/resources/gttm-example/${tune_name}/PR-${tune_name}.xml`),
  ] as DataPromises;
};

type DataContainer = [
  TimeAndRomanAnalysis[],
  TimeAndAnalyzedMelody[],
  MusicXML | undefined,
  GroupingStructure | undefined,
  MetricalStructure | undefined,
  ITimeSpanReduction | undefined,
  IProlongationalReduction | undefined,
]

const compoundMusicData = (tune_id: string, mode: "TSR" | "PR" | "") => (e: DataContainer) => {
  const [roman, read_melody, musicxml, grouping, metric, time_span, prolongation] = e;

  const ts = time_span ? new TimeSpanReduction(time_span).tstree.ts : undefined;
  const pr = prolongation ? new ProlongationalReduction(prolongation).prtree.pr : undefined;

  const measure = tune_id === "doremi" ? 3.5 : 7;
  const reduction = mode === "PR" && pr || mode === "TSR" && ts;
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

export const loadMusicAnalysis = (tune_id: string, mode: "TSR" | "PR" | "") =>
  Promise.all(justLoad(encodeURI(tune_id)))
    .then(compoundMusicData(tune_id, mode));
