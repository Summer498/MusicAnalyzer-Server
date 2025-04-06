import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AnalyzedDataContainer } from "@music-analyzer/analyzed-data-container";
import { bracket_height, CurrentTimeRatio, PianoRollBegin, PianoRollEnd, SongLength } from "@music-analyzer/view-parameters";
import { HTMLsContainer } from "../containers";
import { TitleInfo } from "../containers";
import { AnalyzedMusicData } from "../MusicAnalyzerWindow";
import { getMusicAnalyzerWindow } from "../MusicAnalyzerWindow";
import { ApplicationManager } from "../application-manager";
import { setupUI } from "../setup-ui";
import { EventLoop } from "../EventLoop";

const setPianoRollParameters = (
  hierarchical_melody: SerializedTimeAndAnalyzedMelody[][],
) => {
  const last = <T>(arr: T[]) => arr[arr.length - 1];
  const melody = last(hierarchical_melody);

  const song_length = melody.reduce((p, c) => p.time.end > p.time.end ? p : c).time.end * 1.05;
  const highest_pitch = melody.reduce((p, c) => isNaN(p.note) ? c : isNaN(c.note) ? p : p.note > c.note ? p : c).note || 0;
  const lowest_pitch = melody.reduce((p, c) => isNaN(p.note) ? c : isNaN(c.note) ? p : p.note < c.note ? p : c).note || 0;
  SongLength.set(song_length)
  PianoRollEnd.set(lowest_pitch - 3);
  PianoRollBegin.set(
    [hierarchical_melody.length]
      .map(e => e * bracket_height)
      .map(e => e / 12)
      .map(e => Math.floor(e))
      .map(e => e * 12)
      .map(e => e + highest_pitch)
      .map(e => e + 12)[0]
  )
}

const setFullView = (
  FULL_VIEW: boolean,
  html: HTMLsContainer,
) => {
  if (FULL_VIEW) {
    CurrentTimeRatio.set(0.025);
    html.audio_player.autoplay = false;
  }
  else { html.audio_player.autoplay = true; }
}

export const setup = (
  window: Window,
  html: HTMLsContainer,
  title: TitleInfo,
) => (raw_analyzed_data: AnalyzedMusicData) => {
  const { roman, hierarchical_melody, melody, } = raw_analyzed_data;
  const { beat_info, d_melodies } = new AnalyzedDataContainer(roman, melody, hierarchical_melody)
  setPianoRollParameters(hierarchical_melody);
  const manager = new ApplicationManager(beat_info, roman, hierarchical_melody, melody, d_melodies);
  setFullView(manager.FULL_VIEW, html);

  setupUI(title, html, manager);
  new EventLoop(manager.audio_time_mediator, html.audio_player).update();
  getMusicAnalyzerWindow(window, raw_analyzed_data).onresize = _ => manager.window_size_mediator.onUpdate();
  manager.window_size_mediator.onUpdate();
}
