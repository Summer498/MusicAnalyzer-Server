import { BeatInfo } from "@music-analyzer/beat-estimation";
import { Time, createTime } from "@music-analyzer/time-and";
import { AudioReflectableRegistry, PianoRollTranslateX, WindowReflectableRegistry } from "@music-analyzer/view";
import { TimeRangeController } from "@music-analyzer/controllers";
import { NowAt, PianoRollConverter } from "@music-analyzer/view-parameters";
import { PianoRollHeight } from "@music-analyzer/view-parameters";
import { reservation_range } from "@music-analyzer/view-parameters";
import { play } from "@music-analyzer/synth";

export interface BeatBarModel {
  readonly time: Time
}

export const createBeatBarModel = (
  beat_info: BeatInfo,
  i: number,
): BeatBarModel => ({
  time: createTime(
    i * 60 / beat_info.tempo,
    (i + 1) * 60 / beat_info.tempo,
  ),
})

export interface BeatBarView {
  readonly svg: SVGLineElement
  updateX(x1: number, x2: number): void
  updateY(y1: number, y2: number): void
}

export const createBeatBarView = (svg: SVGLineElement): BeatBarView => ({
  svg,
  updateX(x1: number, x2: number) {
    svg.setAttribute("x1", String(x1))
    svg.setAttribute("x2", String(x2))
  },
  updateY(y1: number, y2: number) {
    svg.setAttribute("y1", String(y1))
    svg.setAttribute("y2", String(y2))
  },
})

export interface BeatBar {
  readonly model: BeatBarModel
  readonly view: BeatBarView
  readonly svg: SVGLineElement
  onWindowResized(): void
  onTimeRangeChanged(): void
  onAudioUpdate(): void
}

export const createBeatBar = (
  model: BeatBarModel,
  view: BeatBarView,
): BeatBar => {
  let y1 = 0
  let y2 = PianoRollHeight.get()
  let sound_reserved = false

  const updateX = () => {
    view.updateX(
      PianoRollConverter.scaled(model.time.begin),
      PianoRollConverter.scaled(model.time.begin),
    )
  }

  const updateY = () => {
    view.updateY(y1, y2)
  }

  const beepBeat = () => {
    const model_is_in_range = createTime(0, reservation_range)
      .map(e => e + NowAt.get())
      .has(model.time.begin)
    if (model_is_in_range) {
      if (sound_reserved === false) {
        play([220], model.time.begin - NowAt.get(), 0.125)
        sound_reserved = true
        setTimeout(() => { sound_reserved = false }, reservation_range * 1000)
      }
    }
  }

  const onWindowResized = () => {
    updateX()
  }

  const onTimeRangeChanged = onWindowResized

  const onAudioUpdate = () => {
    // NOTE: うるさいので停止中
    0 && beepBeat()
  }

  updateX()
  updateY()

  return {
    model,
    view,
    get svg() { return view.svg },
    onWindowResized,
    onTimeRangeChanged,
    onAudioUpdate,
  }
}

export interface RequiredByBeatBarsSeries {
  readonly audio: AudioReflectableRegistry,
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}

export interface BeatBarsSeries {
  readonly children: BeatBar[]
  readonly children_model: { readonly time: Time }[]
  readonly show: BeatBar[]
  readonly svg: SVGGElement
  onAudioUpdate(): void
}

export const createBeatBarsSeries = (
  children: BeatBar[],
): BeatBarsSeries => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g")
  svg.id = "beat-bars"
  children.forEach(e => svg.appendChild(e.svg))

  const children_model = children.map(e => e.model)
  const show = children

  return {
    children,
    children_model,
    get show() { return show },
    svg,
    onAudioUpdate() {
      svg.setAttribute(
        "transform",
        `translate(${PianoRollTranslateX.get()})`,
      )
    },
  }
}

export interface RequiredByBeatElements {
  readonly audio: AudioReflectableRegistry,
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}

export interface BeatElements {
  readonly children: BeatBarsSeries[]
  readonly beat_bars: SVGGElement
}

export const createBeatElements = (
  beat_info: BeatInfo,
  melodies: { time: Time }[],
  controllers: RequiredByBeatElements,
): BeatElements => {
  const N = Math.ceil(
    beat_info.tempo * melodies[melodies.length - 1].time.end,
  ) + beat_info.phase
  const seed = [...Array(N)]

  const beat_bar = seed.map((_, i) => {
    const model = createBeatBarModel(beat_info, i)

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "line")
    svg.id = "bar"
    svg.style.stroke = "rgb(0, 0, 0)"
    svg.style.display = "none" // NOTE: 一旦非表示にしている

    const view = createBeatBarView(svg)
    return createBeatBar(model, view)
  })

  const beat_bars = createBeatBarsSeries(beat_bar)
  beat_bars.children
    .map(e => controllers.audio.addListeners(e.onAudioUpdate))
  beat_bars.children
    .map(e => controllers.window.addListeners(e.onWindowResized))
  const listeners = beat_bars.children.map(e => e.onTimeRangeChanged)
  controllers.time_range.addListeners(...listeners)

  return {
    beat_bars: beat_bars.svg,
    children: [beat_bars],
  }
}
