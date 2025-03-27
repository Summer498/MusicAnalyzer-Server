import { AudioReflectableRegistry } from "@music-analyzer/view/src/reflectable/audio-reflectable-registry";
import { NowAt } from "@music-analyzer/view-parameters";

export class EventLoop {
  readonly fps_element: HTMLParagraphElement;
  private last_audio_time = Number.MIN_SAFE_INTEGER;
  private old_time: number;
  constructor(
    public readonly registry: AudioReflectableRegistry,
    public readonly audio_player: HTMLAudioElement | HTMLVideoElement,
  ) {
    this.old_time = Date.now();
    this.fps_element = document.createElement("p");
    this.fps_element.id = "fps";
    this.fps_element.textContent = `fps:${0}`;
    document.body.insertAdjacentElement("beforeend", this.fps_element);
  }
  audioUpdate() {
    const now_at = this.audio_player.currentTime;
    if (this.audio_player.paused && now_at === this.last_audio_time) { return; }
    this.last_audio_time = now_at;
    NowAt.set(now_at);
    this.registry.onUpdate();
  };
  onUpdate() {
    const now = Date.now();
    const fps = Math.floor(1000 / (now - this.old_time));
    this.fps_element.textContent = `fps:${(" " + fps).slice(-3)}`;
    this.fps_element.style.color = fps < 30 ? "red" : fps < 60 ? "yellow" : "lime";
    this.old_time = now;

    this.audioUpdate();
  };
  update() {
    this.onUpdate();
    requestAnimationFrame(this.update.bind(this));
  }
}
