import { SerializedRomanAnalysisData } from "@music-analyzer/chord-analyze";
import { getJSONfromXML } from "./DataFetcher";
import { DataPromises } from "./data-promises";
import { SerializedMelodyAnalysisData } from "@music-analyzer/melody-analyze";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MusicXML } from "@music-analyzer/musicxml";
import { GroupingStructure } from "@music-analyzer/gttm";
import { IProlongationalReduction } from "@music-analyzer/gttm";
import { ITimeSpanReduction } from "@music-analyzer/gttm";
import { MetricalStructure } from "@music-analyzer/gttm";

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
      .then(res => res.json() as Promise<SerializedRomanAnalysisData>)
      .then(res => {
        if (SerializedRomanAnalysisData.checkVersion(res)) { return SerializedRomanAnalysisData.instantiate(res) }
        else { throw new Error(`Version check: fault in RomanAnalysisData`) }
      })
      .catch(e => fetch(`${analysis_urls.roman}?update`)
        .then(res => res.json() as Promise<SerializedRomanAnalysisData>)
        .then(res => SerializedRomanAnalysisData.instantiate(res))
      )
      .then(res => res?.body)
      .catch(e => { console.error(e); return []; }),
    fetch(analysis_urls.melody)
      .then(res => res.json() as Promise<SerializedMelodyAnalysisData>)
      .then(res => {
        if (SerializedMelodyAnalysisData.checkVersion(res)) { return SerializedMelodyAnalysisData.instantiate(res) }
        else { throw new Error(`Version check: fault in MelodyAnalysisData`) }
      })
      .catch(e => fetch(`${analysis_urls.melody}?update`)
        .then(res => res.json() as Promise<SerializedMelodyAnalysisData>)
        .then(res => SerializedMelodyAnalysisData.instantiate(res))
      )
      .then(res => res?.body)
      .then(res => res?.map(e => ({ ...e, head: e.time })) as SerializedTimeAndAnalyzedMelody[])
      .catch(e => { console.error(e); return []; }),
    getJSONfromXML<MusicXML>(gttm_urls.msc),
    getJSONfromXML<GroupingStructure>(gttm_urls.grp),
    getJSONfromXML<MetricalStructure>(gttm_urls.mtr),
    getJSONfromXML<ITimeSpanReduction>(gttm_urls.tsr),
    getJSONfromXML<IProlongationalReduction>(gttm_urls.pr),
  ] as DataPromises;
};
