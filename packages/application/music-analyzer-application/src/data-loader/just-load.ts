import { RomanAnalysisData } from "@music-analyzer/chord-analyze/src/chord-analyze/time-and-roman-analysis";
import { GroupingStructure } from "@music-analyzer/gttm/src/analysis-result/GRP/grouping-structure";
import { IProlongationalReduction } from "@music-analyzer/gttm/src/analysis-result/PR/interface/i-prolongation-reduction";
import { ITimeSpanReduction } from "@music-analyzer/gttm/src/analysis-result/TSR/interface/i-time-span-reduction";
import { MetricalStructure } from "@music-analyzer/gttm/src/analysis-result/MTR/metric-structure";
import { MelodyAnalysisData } from "@music-analyzer/melody-analyze/src/melody-analysis-data";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { MusicXML } from "@music-analyzer/musicxml";
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
