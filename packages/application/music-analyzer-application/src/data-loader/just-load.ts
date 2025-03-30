import { RomanAnalysisData } from "./facade";
import { GroupingStructure } from "./facade";
import { IProlongationalReduction } from "./facade";
import { ITimeSpanReduction } from "./facade";
import { MetricalStructure } from "./facade";
import { MelodyAnalysisData } from "./facade";
import { TimeAndAnalyzedMelody } from "./facade";
import { MusicXML } from "./facade";
import { getJSONfromXML } from "./DataFetcher";
import { DataPromises } from "./data-promises";

export interface I_GTTM_URLs {
  readonly msc: string
  readonly grp: string
  readonly mtr: string
  readonly tsr: string
  readonly pr: string
}

export interface I_AnalysisURLs {
  readonly melody: string
  readonly roman: string
}

export const justLoad = (
  analysis_urls: I_AnalysisURLs,
  gttm_urls: I_GTTM_URLs,
) => {
  return [
    fetch(analysis_urls.roman)
      .then(res => res.json() as Promise<RomanAnalysisData>)
      .then(res => {
        if (RomanAnalysisData.checkVersion(res)) { return RomanAnalysisData.instantiate(res) }
        else { throw new Error(`Version check: fault in RomanAnalysisData`) }
      })
      .catch(e => fetch(`${analysis_urls.roman}?update`)
        .then(res => res.json() as Promise<RomanAnalysisData>)
        .then(res => RomanAnalysisData.instantiate(res))
      )
      .then(res => res?.body)
      .catch(e => { console.error(e); return []; }),
    fetch(analysis_urls.melody)
      .then(res => res.json() as Promise<MelodyAnalysisData>)
      .then(res => {
        if (MelodyAnalysisData.checkVersion(res)) { return MelodyAnalysisData.instantiate(res) }
        else { throw new Error(`Version check: fault in MelodyAnalysisData`) }
      })
      .catch(e => fetch(`${analysis_urls.melody}?update`)
        .then(res => res.json() as Promise<MelodyAnalysisData>)
        .then(res => MelodyAnalysisData.instantiate(res))
      )
      .then(res => res?.body)
      .then(res => res?.map(e => ({ ...e, head: e.time })) as TimeAndAnalyzedMelody[])
      .catch(e => { console.error(e); return []; }),
    getJSONfromXML<MusicXML>(gttm_urls.msc),
    getJSONfromXML<GroupingStructure>(gttm_urls.grp),
    getJSONfromXML<MetricalStructure>(gttm_urls.mtr),
    getJSONfromXML<ITimeSpanReduction>(gttm_urls.tsr),
    getJSONfromXML<IProlongationalReduction>(gttm_urls.pr),
  ] as DataPromises;
};
