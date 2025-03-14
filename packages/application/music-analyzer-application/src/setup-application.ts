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
  type Mode = "TSR" | "PR" | "";
  const tune_id = url.urlParams.get("tune") || "";
  const mode: Mode = url.urlParams.has("pr") ? "PR" : url.urlParams.has("tsr") ? "TSR" : "";

  updateTitle(html.title, tune_id, mode);
  setAudioPlayer(url.resources, tune_id, url.audio_src, html.audio_player);
  loadMusicAnalysis(tune_id, mode)
    .then(setup(window, html.audio_player, html.piano_roll_place, html.title, mode, tune_id));
}
