export { setAudioPlayer } from "./set-audio-player";
import { I_GTTM_URLs, justLoad } from "./just-load";
import { compoundMusicData } from "./compound-music-data";
import { URLsContainer } from "../containers/URLs-container";

class GTTM_URLs implements I_GTTM_URLs {
  readonly msc: string
  readonly grp: string
  readonly mtr: string
  readonly tsr: string
  readonly pr: string
  constructor(url: URLsContainer) {
    this.msc = `${url.resources}/gttm-example/${url.title.id}/MSC-${url.title.id}.xml`
    this.grp = `${url.resources}/gttm-example/${url.title.id}/GPR-${url.title.id}.xml`
    this.mtr = `${url.resources}/gttm-example/${url.title.id}/MPR-${url.title.id}.xml`
    this.tsr = `${url.resources}/gttm-example/${url.title.id}/TS-${url.title.id}.xml`
    this.pr = `${url.resources}/gttm-example/${url.title.id}/PR-${url.title.id}.xml`
  }
}

class AnalysisURLs {
  readonly melody: string
  readonly roman: string
  constructor(url: URLsContainer) {
    this.melody = `${url.resources}/${url.title.id}/analyzed/melody/crepe/manalyze.json`
    this.roman = `${url.resources}/${url.title.id}/analyzed/chord/roman.json`
  }
}

export const loadMusicAnalysis = (url: URLsContainer) => {
  const tune_name = encodeURI(url.title.id)
  return Promise.all(justLoad(new AnalysisURLs(url), new GTTM_URLs(url)))
    .then(compoundMusicData(url.title));
}
