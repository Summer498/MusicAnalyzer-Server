export { setAudioPlayer } from "./set-audio-player";
import { I_GTTM_URLs, justLoad } from "./just-load";
import { compoundMusicData } from "./compound-music-data";

const resources = `/MusicAnalyzer-server/resources`;
const audio_src = `${resources}/Hierarchical Analysis Sample/sample1.mp4`;

class GTTM_URLs implements I_GTTM_URLs {
  readonly msc: string
  readonly grp: string
  readonly mtr: string
  readonly tsr: string
  readonly pr: string
  constructor(tune_name: string) {
    this.msc = `${resources}/gttm-example/${tune_name}/MSC-${tune_name}.xml`
    this.grp = `${resources}/gttm-example/${tune_name}/GPR-${tune_name}.xml`
    this.mtr = `${resources}/gttm-example/${tune_name}/MPR-${tune_name}.xml`
    this.tsr = `${resources}/gttm-example/${tune_name}/TS-${tune_name}.xml`
    this.pr = `${resources}/gttm-example/${tune_name}/PR-${tune_name}.xml`
  }
}

class AnalysisURLs {
  readonly melody: string
  readonly roman: string
  constructor(tune_name: string) {
    this.melody = `${resources}/${tune_name}/analyzed/melody/crepe/manalyze.json`
    this.roman = `${resources}/${tune_name}/analyzed/chord/roman.json`
  }
}

export const loadMusicAnalysis = (tune_id: string, mode: "TSR" | "PR" | "") => {
  const tune_name = encodeURI(tune_id)
  return Promise.all(justLoad(new AnalysisURLs(tune_name), new GTTM_URLs(tune_name)))
    .then(compoundMusicData(tune_id, mode));
}
