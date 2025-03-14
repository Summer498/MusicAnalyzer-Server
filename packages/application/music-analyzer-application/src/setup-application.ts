import { loadMusicAnalysis, setAudioPlayer } from "./data-loader";
import { HTMLsContainer } from "./HTMLs-container";
import { setup } from "./setup";
import { updateTitle } from "./update-title";
import { URLsContainer } from "./URLs-container";

export const setupApplication = (
  window: Window,
  html: HTMLsContainer,
  url: URLsContainer,
) => {
  updateTitle(html.title, url.gttm_sample);
  setAudioPlayer(url.resources, url.gttm_sample.id, url.audio_src, html.audio_player);
  loadMusicAnalysis(url.gttm_sample.mode, url.gttm_sample.id)
    .then(setup(window, html, url.gttm_sample.mode, url.gttm_sample.id));
}
