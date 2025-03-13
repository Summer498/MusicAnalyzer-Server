import { loadMusicAnalysis, setAudioPlayer } from "./data-loader";
import { setup } from "./setup";
import { updateTitle } from "./update-title";

export const setupApplication = (
  window: Window,
  urlParams: URLSearchParams,
  audio_src: string,
  audio_player: HTMLAudioElement | HTMLVideoElement,
  piano_roll_place: HTMLDivElement,
  title: HTMLHeadingElement,
  resources: string,
) => {
  type Mode = "TSR" | "PR" | "";
  const tune_id = urlParams.get("tune") || "";
  const mode: Mode = urlParams.has("pr") ? "PR" : urlParams.has("tsr") ? "TSR" : "";

  updateTitle(title, tune_id, mode);
  setAudioPlayer(resources, tune_id, audio_src, audio_player);
  loadMusicAnalysis(tune_id, mode)
    .then(setup(window, audio_player, piano_roll_place, title, mode, tune_id));
}
